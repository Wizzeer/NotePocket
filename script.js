let notesArray;
let modalChange = document.getElementById('modalButtons');
let notesRow = document.getElementById('notesRow');
let pinnedNotesRow = document.getElementById('pinnedNotesRow');
let notesColor = document.getElementById('colorButton');
let pinnedNotesColor = document.getElementById('pinnedColorButton');
let userInputTitle = document.getElementById("title");
let userInputText = document.getElementById("text");
let isEditing=false;
let colorsArray=[];
//Checking if we have notes in localstorage, if yes load them, if no create new one
if(localStorage.getItem('colors')){
    colorsArray=JSON.parse(localStorage.getItem('colors'));
    notesColor.value = colorsArray[0];
    pinnedNotesColor.value = colorsArray[1];
}
else{
    notesColor.value = "#7eae9d";
    pinnedNotesColor.value = "#da8484";
}

if(localStorage.getItem('notes')){
    notesArray=JSON.parse(localStorage.getItem('notes'));
}
else{
    notesArray=[];
}

let note;

class Note{
    constructor(title, text, date, isPinned){
        this.title=title;
        this.text=text;
        this.date=date;
        this.isPinned=isPinned;
    }
}

window.onload = function(){
    loadNotes();
    changeColor();
}

function loadNotes() {

    pinnedNotesRow.innerHTML = "";
    notesRow.innerHTML = "";
    // Adding notes to page
    notesArray.forEach(element => {
        if (element.isPinned) {
            pinnedNotesRow.innerHTML += "<div class=\"col-6\">\
                                <div class=\"pinnedNoteDivTitle\" style=\"background-color:"+colorsArray[1]+";border-color:"+colorsArray[1]+"\">\
                                    <h4>"+ element.title + "</h4>\
                                    <span class=\"date\">Added on "+ new Date(element.date).toLocaleString() + "</span>\
                                    <span class=\"pinButton\"><input type=\"checkbox\" class=\"form-check-input\" onchange=\"pinNote("+ element.date + ")\" id=\"exampleCheck1\" checked>Pin</span>\
                                    <i class=\"icon-edit\" onclick=\"editNote("+element.date+")\"></i>\
                                    <button type=\"button\" class=\"close closeButton\" data-toggle=\"modal\" onclick=\"openModal("+ element.date + ")\" data-target=\"#deleteOneNoteModal\" aria-label=\"Close\">\
                                        <span aria-hidden=\"true\">&times;</span>\
                                    </button>\
                                </div>\
                                <div class=\"pinnedNoteDivText\" id=\""+element.date+"\" style=\"border-color:"+colorsArray[1]+"\">"+ element.text + "</div>\
                            </div>"
        }
        else {
            notesRow.innerHTML += "<div class=\"col-6\">\
                                <div class=\"noteDivTitle\" style=\"background-color:"+colorsArray[0]+"\">\
                                    <h4>"+ element.title + "</h4>\
                                    <span class=\"date\">Added on "+ new Date(element.date).toLocaleString() + "</span>\
                                    <span class=\"pinButton\"><input type=\"checkbox\" class=\"form-check-input\" onchange=\"pinNote("+ element.date + ")\" id=\"exampleCheck1\">Pin</span>\
                                    <i class=\"icon-edit\" onclick=\"editNote("+element.date+")\"></i>\
                                    <button type=\"button\" class=\"close closeButton\" data-toggle=\"modal\" onclick=\"openModal("+ element.date + ")\" data-target=\"#deleteOneNoteModal\" aria-label=\"Close\">\
                                        <span aria-hidden=\"true\">&times;</span>\
                                    </button>\
                                </div>\
                                <div class=\"noteDivText\" id=\""+element.date+"\">"+ element.text + "</div>\
                            </div>"
        }


    });
}

 
// Create note
function addNote(){
    let actualDate = Date.now();
    textWithAddedBreakLines=(userInputText.value).replace(/\n/g, "<br/>");
    textWithHardSpaces=textWithAddedBreakLines.replace(/ /g, '&nbsp;');
    console.log(textWithAddedBreakLines)
    note = new Note(userInputTitle.value, textWithHardSpaces, actualDate, false)
    notesArray.push(note);
    localStorage.setItem('notes', JSON.stringify(notesArray));
    console.log(note)
    loadNotes();
    userInputTitle.value="";
    userInputText.value="";
}

function pinNote(timeWhenNoteWasAdded){
    let i=0;
    notesArray.forEach(element => {
        if(element.date==timeWhenNoteWasAdded){
            notesArray[i].isPinned=!notesArray[i].isPinned;
            console.log(notesArray[i].isPinned);
        }
        i++
    });
    localStorage.setItem('notes', JSON.stringify(notesArray));
    loadNotes();
    
}

function deleteAllNotes(){
    console.log(notesArray)
    localStorage.clear();
    notesArray=[];
    loadNotes();
}

function openModal(timeWhenNoteWasAdded){
    modalChange.innerHTML="<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\
    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" onclick=\"deleteNote("+timeWhenNoteWasAdded+")\">Yes, delete it</button>"
}

function deleteNote(timeWhenNoteWasAdded){
    let i=0;
    notesArray.forEach(element => {
        if(element.date==timeWhenNoteWasAdded){
            notesArray.splice(i, 1);
        }
        i++
    });
    localStorage.setItem('notes', JSON.stringify(notesArray));
    loadNotes();

}

function editNote(timeWhenNoteWasAdded){
    isEditing =!isEditing;
    if(isEditing==true){
        let i=0;
        notesArray.forEach(element => {
        if(element.date==timeWhenNoteWasAdded){
            let text = document.getElementById(timeWhenNoteWasAdded);
            textWithoutAddedBreakLines=(notesArray[i].text).replace(/<br\/>/g, "&#013");
            textWithoutHardSpaces=textWithoutAddedBreakLines.replace(/&nbsp;/g, ' ');
            text.innerHTML= "<textarea class=\"form-control\" id=\""+(element.date+1)+"\" rows=\"4\">"+textWithoutHardSpaces+"</textarea>\
            <button type=\"button\" class=\"btn btn-secondary\" id=\"acceptEditButton\" onclick=\"acceptEdit("+(element.date+1)+", "+i+")\">Accept changes</button>"
            
        }
        i++
    });
    }
    else{
        let i=0;
        notesArray.forEach(element => {
        if(element.date==timeWhenNoteWasAdded){
            let text = document.getElementById(timeWhenNoteWasAdded);
            text.innerHTML= notesArray[i].text;
        }
        i++
    });
    }
    
}

function acceptEdit(idToAccept, noteId){
    console.log("elo")
    let acceptedText=document.getElementById(idToAccept);
    textWithAddedBreakLines=(acceptedText.value).replace(/\n/g, "<br/>");
    textWithHardSpaces=textWithAddedBreakLines.replace(/ /g, '&nbsp;');
    notesArray[noteId].text=textWithHardSpaces;
    localStorage.setItem('notes', JSON.stringify(notesArray));
    loadNotes();
}

function changeColor(){
    console.log(colorsArray)
    colorsArray[0]=(notesColor.value)
    colorsArray[1]=(pinnedNotesColor.value)
    localStorage.setItem('colors', JSON.stringify(colorsArray));
    let pinnedNoteDivTitle = document.getElementsByClassName('pinnedNoteDivTitle');
    let pinnedNoteDivText = document.getElementsByClassName('pinnedNoteDivText');
    for (let i = 0; i < pinnedNoteDivTitle.length; i++) {
        pinnedNoteDivTitle[i].style.backgroundColor=pinnedNotesColor.value;
        pinnedNoteDivTitle[i].style.borderColor=pinnedNotesColor.value;
        pinnedNoteDivText[i].style.borderColor=pinnedNotesColor.value;
    }

    let noteDivTitle = document.getElementsByClassName('noteDivTitle');
    for (let i = 0; i < noteDivTitle.length; i++) {
        noteDivTitle[i].style.backgroundColor=notesColor.value;
    }
}

function setDefaultColors(){
    colorsArray[0]="#7faf9d";
    colorsArray[1]="#db8585";
    notesColor.value=colorsArray[0];
    pinnedNotesColor.value=colorsArray[1];
    localStorage.removeItem('colors');
    let pinnedNoteDivTitle = document.getElementsByClassName('pinnedNoteDivTitle');
    let pinnedNoteDivText = document.getElementsByClassName('pinnedNoteDivText');
    for (let i = 0; i < pinnedNoteDivTitle.length; i++) {
        pinnedNoteDivTitle[i].style.backgroundColor=colorsArray[1];
        pinnedNoteDivTitle[i].style.borderColor=colorsArray[1];
        pinnedNoteDivText[i].style.borderColor=colorsArray[1];
    }

    let noteDivTitle = document.getElementsByClassName('noteDivTitle');
    for (let i = 0; i < noteDivTitle.length; i++) {
        noteDivTitle[i].style.backgroundColor=colorsArray[0];
    }

    
}

