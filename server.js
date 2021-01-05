//Dependencie
const express = require("express");
const path = require("path");
const fs = require("fs");
// require("./public/assets/js/index.js")
// require uniqid dependency for creating unique id for each new note
const uniqid = require('uniqid');
   
//Setup the Express App
const app = express();
const PORT = process.env.PORT || 3000;

//Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// makes public folder available to user 
app.use(express.static('public'));

// Route

app.get("/api/notes", function (req, res) {

    // Use the fs module to read the file 
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) throw err;

        // Parse the file contents with JSON.parse() to get the real data
        let content = JSON.parse(data);

        // Then send the paresed data back to the client with res.json();
        res.json(content);
    });
});

//POST request update db.json
app.post("/api/notes", function (req, res) {

    // Acess the POSTed data in 'req.body
    let newNote = req.body;

    // Create newNote.id with uniqid api
    newNote.id = uniqid.time();

    // use fs module to read the file
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) throw err;

        // parse file contents with JSON.parse() to get real data and return as JSON
        let allNotes = JSON.parse(data);
        allNotes.push(newNote);
        let allNotesString = JSON.stringify(allNotes);

        // add new note to db.json and refresh page
        fs.writeFile(path.join(__dirname + "/db/db.json"), allNotesString, function (err) {
            if (err) throw err;
            res.json(allNotes);
        });
    });
});

// Route delete note base on id comparison
app.delete("/api/notes/:id", function (req, res) {

    // access id from req.params
    const idToDelete = req.params.id;

    // use fs.readFile to get all note data and parse the data
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) throw err;

        let existNotes = JSON.parse(data);

        // Find one with matching id and return the note with unmatched id(s)
        let filteredNotes = existNotes.filter((note) => {
            return note.id != idToDelete;
        });

        let existNotesString = JSON.stringify(filteredNotes);

        // add updated notes to db.json and refresh page
        fs.writeFile(path.join(__dirname + "/db/db.json"), existNotesString, function (err) {
            if (err) throw err;
            res.json(existNotesString);
        });
    });
});

// route that send notes.html to user
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Basic route that sends the user to the AJAX Page
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//start the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

