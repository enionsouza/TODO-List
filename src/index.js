/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */

import './style.css';
import Task from './task';
import ThreeVerticalDots from './img/3-vertical-dots.svg';

class ToDo {
  constructor() {
    this.tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
    this.renderList();
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
        <li>
          <input type="checkbox" id="check-${task.index}" class="checkbox">
          <p class="description">${task.description}</p>
          <button class="li-btn bin hidden" id="bin-${task.index}"></button>
          <button class="li-btn v-dots" id="v-dots-${task.index}"></button>
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
  }
}

const myToDoList = new ToDo();

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
