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
        ${task.description}
      </li>
      `;
    }
  }
}

const myToDoList = new ToDo();
if (localStorage.tasks === undefined) {
  myToDoList.addTask('My first task');
  myToDoList.addTask('My second task');
  myToDoList.addTask('My third task');
}

window.onload = myToDoList.renderList.apply(myToDoList);

const newItemBtn = document.getElementById('new-item-btn');
newItemBtn.addEventListener('click', (e) => {
  e.preventDefault();
  myToDoList.addTask.apply(myToDoList);
});
