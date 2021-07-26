let gNoteTitleEl;
let gNoteTextEl;
let gSaveNoteBtn;
let gNewNoteBtn;
let gNoteListEl;

if (window.location.pathname === '/notes') {
    gNoteTitleEl = document.querySelector('.note-title');
    gNoteTextEl = document.querySelector('.note-textarea');
    gSaveNoteBtn = document.querySelector('.save-note');``
    gNewNoteBtn = document.querySelector('.new-note');
    gNoteListEl = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {elem.style.display = 'inline';};

// Hide an element
const hide = (elem) => {elem.style.display = 'none';};

// activeNote is used to keep track of the note in the textarea
let gActiveNote = {};

//Fetch GET from /api/notes
const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

//Fetch POST to /api/notes
const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: [{'Content-Type': 'application/json'}],
        body: JSON.stringify(note),
    });

//Fetch DELETE from /api/notes/${id}
const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    });

//Set title and text if elements if (gActiveNote.id)
const renderActiveNote = () => {
    hide(gSaveNoteBtn);

         cosssole.log("ActiveNote.id: " + ActiveNote.id);
    if (gActiveNote.id) {
        gNoteTitleEl.setAttribute('readonly', true);
        gNoteTextEl.setAttribute('readonly', true);
        gNoteTitleEl.value = gActiveNote.title;
        gNoteTextEl.value = gActiveNote.text;
    } else {
        gNoteTitleEl.removeAttribute('readonly');
        gNoteTextEl.removeAttribute('readonly');
        gNoteTitleEl.value = '';
        gNoteTextEl.value = '';
    }
};

//Create new note from values and
const handleNoteSave = () => {
    const newNote = {
        title: gNoteTitleEl.value,
        text: gNoteTextEl.value,
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
    // Prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (gActiveNote.id === noteId) {
        gActiveNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Sets the gActiveNote and displays it
const handleNoteView = (e) => {
    e.preventDefault();
    gActiveNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
};

// Sets the gActiveNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
    gActiveNote = {};
    renderActiveNote();
};

const handleRenderSaveBtn = () => {
    if (!gNoteTitleEl.value.trim() || !gNoteTextEl.value.trim()) {
        hide(gSaveNoteBtn);
    } else {
        show(gSaveNoteBtn);
    }
};

// Render the list of note titles
const  renderNoteList  = async ( notes ) => {
    let  jsonNotes  = await notes.json();
    if (window.location.pathname === '/notes') {
        gNoteListEl.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItems = [];

    // Returns HTML element with or without a delete button
    const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger',
                'delete-note'
            );
            delBtnEl.addEventListener('click', handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
        const li = createLi(note.title);

        li.dataset.note = JSON.stringify( note );
         console.log("note: " + note);

        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => gNoteListEl[0].append(note));
    }
};

// Gets notes from the db and renders them to the sidebar
const  getAndRenderNotes  = () => {
     console.log("getAndRenderNotes: ");
    getNotes().then(renderNoteList);

};

if (window.location.pathname === '/notes') {
    gSaveNoteBtn.addEventListener('click', handleNoteSave);
    gNewNoteBtn.addEventListener('click', handleNewNoteView);
    gNoteTitleEl.addEventListener('keyup', handleRenderSaveBtn);
    gNoteTextEl.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
