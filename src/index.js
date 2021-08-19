/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

import './style.css';
import Task from './task';

class ToDo {
  constructor() {
    this.tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
  }

  addTask(description = '') {
    const newEntry = document.getElementById('new-item');
    if (description || newEntry.value) {
      if (!description) description = newEntry.value;
      newEntry.value = '';
      this.tasks.push(new Task(description, this.tasks.length));
      this.updateLocalStorage();
      this.renderList();
    }
  }

  updateLocalStorage() {
    localStorage.tasks = JSON.stringify(this.tasks);
  }

  renderList() {
    const list = document.getElementById('my-list');
    list.innerHTML = '';
    for (const task of this.tasks) {
      list.innerHTML += `
        <li id="task-${task.index}">
          <input type="checkbox" class="checkbox" checked="${task.completed}">
          <p class="description ${task.completed ? 'completed' : ''}">${task.description}</p>
          <button class="li-btn bin hidden"></button>
          <button class="li-btn v-dots"></button>
        </li>
      `;
    }
    if (this.tasks) {
      list.innerHTML += `
        <li>
          <a class="clear-completed">Clear all completed</a>
        </li>
      `;
    }
    for (const task of this.tasks) {
      const checkbox = document.getElementById(`task-${task.index}`).children[0];
      checkbox.addEventListener('change', toggleCompleted);
      checkbox.checked = task.completed;
    }
  }
}

const myToDoList = new ToDo();

function toggleCompleted(e) {
  const index = e.target.parentElement.id.split('-')[1];
  myToDoList.tasks[index].completed = !myToDoList.tasks[index].completed;
  document.getElementById(`task-${index}`).children[1].classList.toggle('completed');
  myToDoList.updateLocalStorage();
  // console.table(JSON.parse(localStorage.tasks));
}

// seed for the array of objects (tasks)
if (localStorage.tasks === undefined) {
  myToDoList.addTask('My first task');
  myToDoList.addTask('My second task');
  myToDoList.addTask('My third task');
}

// render the array of objects
window.onload = myToDoList.renderList.apply(myToDoList);

// add functionality for adding new tasks
const newItemBtn = document.getElementById('new-item-btn');
newItemBtn.addEventListener('click', (e) => {
  e.preventDefault();
  myToDoList.addTask.apply(myToDoList);
});
