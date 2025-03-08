import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  // const s1 = {
  //     "name": "Alok",
  //     "class": "1A"
  // }
  // const [state, setState] = useState(s1)
  // const update = ()=>{
  //     setTimeout(()=>{
  //         setState({
  //             "name":"Abhi",
  //             "class":"1B"
  //         })
  //     }, 1000)
  // }
  const host = "http://localhost:8080";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (json.error) {
        console.error(json.error);
        return;
      }
      setNotes(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const note = await response.json();
      if (note.error) {
        console.error(note.error);
        return;
      }
      setNotes(notes.concat(note));
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (json.error) {
        console.error(json.error);
        return;
      }
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const json = await response.json();
      if (json.error) {
        console.error(json.error);
        return;
      }

      // Create a deep copy of notes
      const newNotes = JSON.parse(JSON.stringify(notes));
      // Logic to edit in client
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    // <NoteContext.Provider value={{state:state, update:update}}>
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
