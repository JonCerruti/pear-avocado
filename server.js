const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT || 3001;

const app = express();

//Middleware for parsing JSON and urlencoded form data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'))
});


// POST to add new notes to db.json 
app.post("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const addNote = req.body;
  addNote.id = uuidv4();
  notes.push(addNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
  console.log("note added")
});

//delete notes
app.delete("/api/notes/:id", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const deleteNote = notes.filter((noteDelete) => noteDelete.id !== req.params.id);
  fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote));
  res.json(deleteNote);
  console.log("Note Deleted")
});

// GET Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

// GET Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () =>{
  console.info(`app listening at http://localhost:${PORT} 🚀`)
});