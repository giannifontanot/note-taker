// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');


// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000

// Sets up the Express app to handle data parsing
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// ----------------------------------------------------- //
// Route to process the data sent
// !GET
    app.get('/api/notes', (req, res) => {
        res.header("Content-Type", "application/json");
        res.sendFile(path.join(__dirname, './db/db.json'),( err )=>{
            if(err) {
                if (err.status === 404) {
                    fs.writeFile('./db/db.json', "[]", err => {
                        res.sendFile(path.join(__dirname, './db/db.json'));
                        if (err) {
                            console.log("err: app.get:" + err);
                        }
                    });
                } else {
                    console.log("err: app.get:" + err);
                }
            }

        });

    });

// ----------------------------------------------------- //
// !POST
app.post('/api/notes', (req, res) => {

    // Check that the file exists locally
    if (!fs.existsSync('./db/db.json')) {
        fs.writeFile('./db/db.json', "", err => {
            if (err) {
                console.log("err: app.post:" + err);
            }
        });
    }

    // Read de db.json file and parse it
    const jsonData = fs.readFileSync('./db/db.json', {encoding: 'utf-8'});
    const objectData = JSON.parse(jsonData);
    let newId = 1;

    // In case db.json already have data
    if(objectData.length > 0) {
        // Getting a sub array from the JSON array
        const lastObject = objectData.slice(objectData.length - 1, objectData.length);

        // lastObject is still an array of objects. To get data we need to reference what object in the array.
        let lastId = lastObject[0].id;
        newId = ++lastId;
    }

    //Create new note with the request data
    const newNote = {"title": req.body.title, "text": req.body.text, "id": newId};
    objectData.push(newNote);

    // Write the file
    fs.writeFile('./db/db.json', JSON.stringify(objectData), err => {
        if (err) {
            console.log("err: app.post:" + err);
        }
    });
    //Close the connection
    res.end();
});
// ----------------------------------------------------- //
// !DELETE
app.delete('/api/notes/:id', (req, res) => {
    // Receive the id to delete
    const id = req.params.id;
    // Read JSON file
    let jsonData = fs.readFileSync('./db/db.json', {encoding: "utf8"});
    let objectData = JSON.parse(jsonData);

    objectData.forEach((element, index, array) => {
        if (element.id.toString() === id) {
            array.splice(index, 1);
        }
    });
    //Rewrite the file with the new data
    fs.writeFile('./db/db.json', JSON.stringify(objectData), err => {
        if (err) {
            console.log("err: app.delete:" + err);
        }
    });

    //Close the request/response
    res.end();
});

// ----------------------------------------------------- //
// Routes to static HTML
app.get('/notes',
    (req, res) => {
        res.sendFile(path.join(__dirname, './public/notes.html'))
    });
// Routes to static HTML
app.get('/',
    (req, res) => {
        res.sendFile(path.join(__dirname, './public/index.html'))
    });
// WILDCARD route to static HTML
app.get('*',
    (req, res) => {
        res.header("Content-Type", "text/html; charset=utf-8");
        res.sendFile(path.join(__dirname, './public/index.html'));
    });

// Server is listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

