import './style.css';
import ToDo from './todo';

const myToDoList = new ToDo();

// seed for the array of objects (tasks)
if (localStorage.tasks === undefined) {
  myToDoList.addTask('My first task');
  myToDoList.addTask('My second task');
  myToDoList.addTask('My third task');
}

// render the array of objects
window.onload = myToDoList.renderList();

// add functionality for adding new tasks
const newItemBtn = document.getElementById('new-item-btn');
newItemBtn.addEventListener('click', (e) => {
  e.preventDefault();
  myToDoList.addTask.apply(myToDoList);
});
