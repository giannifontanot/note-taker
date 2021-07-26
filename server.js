// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Data is stored in an array
let tables = [];

// Sets up the Express App
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes to static HTML
app.get('/',
    (req, res) => {
        res.sendFile(path.join(__dirname, './public/index.html'))
        console.log("landed  on root: ");
    });
app.get('/notes',
    (req, res) => {
        res.sendFile(path.join(__dirname, './public/notes.html'))
        console.log("landed on /notes: ");
    });

// ----------------------------------------------------- //

// Route to process the data sent
app.post('/saveReservation', (req, res) => {

    const   newReservation   =  req.body ;
    console.log("newReservation: " + JSON.stringify(newReservation));

    tables.push( newReservation );
    res.sendFile(path.join(__dirname, 'index.html'));

});
// Route to process the data sent
app.get('/fetchTableList', (req, res) => {

    console.log("tables: " + tables);
    fs.writeFile("log.txt", JSON.stringify(tables), err => {
        console.log(err);
    });
    return res.json(tables);

});

// Server is listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

