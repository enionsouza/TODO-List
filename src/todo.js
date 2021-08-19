import Task from './task';

export default class {
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

  updateIndexes() {
    let i = 0;
    this.tasks.forEach((task) => {
      task.index = i;
      i += 1;
    });
    this.updateLocalStorage();
    this.renderList();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.updateIndexes();
  }

  clearAllBtn() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.updateIndexes();
  }

  updateLocalStorage() {
    localStorage.tasks = JSON.stringify(this.tasks);
  }

  renderList() {
    const list = document.getElementById('my-list');
    list.innerHTML = '';
    this.tasks.forEach((task) => {
      list.innerHTML += `
        <li id="task-${task.index}">
          <input type="checkbox" class="checkbox" checked="${task.completed}">
          <p class="description${task.completed ? ' completed' : ''}" contenteditable="true">${task.description}</p>
          <button class="li-btn bin hidden"></button>
          <button class="li-btn v-dots"></button>
        </li>
      `;
    });
    if (this.tasks) {
      list.innerHTML += `
        <li>
          <a class="clear-completed">Clear all completed</a>
        </li>
      `;
    }
    this.addEventListeners();
  }

  addEventListeners() {
    const obj = this;

    function toggleCompleted(e) {
      const index = e.target.parentElement.id.split('-')[1];
      obj.tasks[index].completed = !obj.tasks[index].completed;
      document.getElementById(`task-${index}`).children[1].classList.toggle('completed');
      obj.updateLocalStorage();
      // console.table(JSON.parse(localStorage.tasks));
    }

    function toggleEditMode(parent) {
      parent.classList.toggle('edit-mode');
      parent.children[2].classList.toggle('hidden');
      parent.children[3].classList.toggle('hidden');
    }

    this.tasks.forEach((task) => {
      // add event listeners for the checkboxes (completed indicator)
      const checkbox = document.getElementById(`task-${task.index}`).children[0];
      checkbox.addEventListener('change', toggleCompleted);
      checkbox.checked = task.completed;

      // add event listeners for editing a task description
      const description = document.getElementById(`task-${task.index}`).children[1];
      description.addEventListener('focus', (e) => {
        toggleEditMode(e.target.parentElement);
      });
      description.addEventListener('blur', () => {
        setTimeout(() => {
          toggleEditMode(description.parentElement);
          task.description = description.textContent;
          obj.updateLocalStorage();
        }, 100);
      });

      // add event listeners for deleting a task
      const binBtn = document.getElementById(`task-${task.index}`).children[2];
      binBtn.addEventListener('click', () => obj.deleteTask(task.index));
    });

    // add event for 'Clear all completed'
    const clearAllBtn = document.querySelector('.clear-completed');
    clearAllBtn.addEventListener('click', () => obj.clearAllBtn());
  }
}
