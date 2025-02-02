// Import functions from edit.js
import { openEditForm } from "./edit.js";

// Global Variables
/**
 * @type {Array}
 */
var data = [];
// TODO: consider another array to store deleted tasks
// var deleted = [];

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

/**
 * @function init
 * Starts the task program, all function calls trace back here
 * 
 * 
 * 
 * 
 * 
 * 
 * yeet
 */
function init() {
  let tasks = getTasksFromStorage();
  // Add each task to the <tbody> element
  addTaskToDocument(tasks);
  // Add the event listeners to the form elements
  initFormHandler();
}

// -------------------------- ADD TASK POPUP --------------------------------------

// Add functions to add button on-click
document.getElementById("addButton").addEventListener("click", openForm);
document.getElementById("cancelButton").addEventListener("click", closeForm);

/*
 * Add button function
 * Once the user clicks on the add button, the popup form should pop up
 * Digga was ist hier los amena
 */
function openForm() {
  document.getElementById("popupForm").style.display = "block";
}

/*
 * Cancel button function
 * Once the user clicks on the button, the popup form should be closed
 */
function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

// -------------------------- ADD DATA STORAGE --------------------------------------
/**
 * Generates a unique ID using crypto.randomUUID.
 * https://stackoverflow.com/questions/1155008/how-unique-is-uuid
 * @returns {string} A unique string ID to represent each task.
 */
function generateUniqueID() {
  return crypto.randomUUID();
}

/**
 * Takes in an array of tasks and for each task creates a
 * new <to-do-task> element, adds the task data to that item
 * using element.data = {...}, and then appends that new task
 * to <tbody>
 * @param {Array<Object>} tasks An array of recipes
 */
function addTaskToDocument(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    addTask(tasks[i]);
  }
}

/**
 * Populate the table using the data object.
 *
 * @param {Object} data - The data to pass into the <task>, must be of the
 *                        following format:
 *                        {
 *                          "id": "number",
 *                          "name": "string",
 *                          "hours": "number",
 *                          "minutes": "number",
 *                          "type": "string",
 *                          "status": "string",
 *                          "notes": "string"
 *                        }
 */
function addTask(data) {
  // populate data in the table
  const tableRow = document.createElement("tr");

  // The information from data is added following the below format
  tableRow.innerHTML = `<td>${data.name}</td>
  <td>${data.hours} hr ${data.minutes} min</td>
  <td>${data.status}</td>
  <td><button class="editButton" id="editButton${data.id}">
  <img id="editIcon" src="/source/images/edit-icon.svg" alt="Edit icon button for task ${data.id}"></button></td>`;
  tableRow.id = `task${data.id}`;
  tableRow.className = "task";

  document.body.querySelector("tbody").append(tableRow);

  // On Click Task Name, Show the Task Notes
  // Create another task row tag and put the notes into it
  const tableRowNotes = document.createElement("tr");
  tableRowNotes.innerHTML = `<td COLSPAN="4">${data.notes}</td>`;
  // Each note will have its own ID
  tableRowNotes.className = "notes";
  tableRowNotes.id = `notes${data.id}`;
  // tableRow.append(tableRowNotes);
  document.body.querySelector("tbody").append(tableRowNotes);

  // Display notes when clicked, hide when clicked again
  tableRow.addEventListener("click", () => { 
    document.getElementById(`notes${data.id}`).style.display = (document.getElementById(`notes${data.id}`).style.display=="none") ? "table-row" : "none";
    //document.getElementById(`task${data.id}`).childNodes.forEach(x => {if(x.localName == "td") x.style.backgroundColor = (document.getElementById(`notes${data.id}`).style.display=="none") ? "none" : "#e8e0e2"});
  });
  // When editbutton is clicked, it will call openEditForm to open the form with the populated data
  document.getElementById(`editButton${data.id}`).addEventListener("click", () => { 
    openEditForm(data.id);
   });
}

/**
 * Reads 'tasks' from localStorage and returns an array of
 * all of the tasks found. If nothing is found in localStorage for
 * 'tasks', an empty array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

/**
 * Takes in an array of tasks, converts it to a string, and then
 * saves that string to 'tasks' in localStorage
 * @param {Array<Object>} tasks An array of recipes
 */
function saveTaskToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/** STORE DATA FROM TASK POPUP
 * Initializes the handler function when the task form is submitted.
 *
 * Task data is populated from each input in the form, generated with a unique ID, and
 * assigned the initial status. The new task is then added into local storage.
 */
function initFormHandler() {
  // Get data from task popup form
  const form = document.querySelector("form");

  form.addEventListener("submit", () => {
    let formData = new FormData(form);
    let taskData = new Object();
    for (const key of formData.keys()) {
      taskData[key] = formData.get(key);
    }

    taskData.status = "Planned";
    taskData.id = generateUniqueID();

    //populate the table
    addTask(taskData);

    // save data to global variable
    data.push(taskData);

    let tasks = getTasksFromStorage();
    tasks.push(taskData);
    saveTaskToStorage(tasks);
  });
}

export { getTasksFromStorage, saveTaskToStorage };