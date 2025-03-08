const jwt = require("jsonwebtoken");
const UserModel = require("../../infrastructure/models/UserModel");
const User = require("../../domain/entities/User");

class UserService {
  async createUser(name, email, password) {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await UserModel.create({
        name,
        email,
        password,
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      throw new Error(error.message || "Error creating user");
    }
  }

  async authenticateUser(email, password) {
    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      return {
        success: true,
        authtoken: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    }
    throw new Error("Invalid email or password");
  }

  async getUserById(id) {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}

module.exports = new UserService();
