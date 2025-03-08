const express = require("express");
const userService = require("../../../application/services/UserService");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post("/auth/createuser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    const authData = await userService.authenticateUser(email, password);
    res.status(201).json({
      success: true,
      authtoken: authData.authtoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.authenticateUser(email, password);
    res.json(data);
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// ROUTE 3: Get logged-in user details using: GET "/api/auth/getuser". Login required
router.get("/auth/getuser", protect, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

module.exports = router;
