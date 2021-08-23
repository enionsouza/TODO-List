import Task from './task';
import allowNewline from './allow-newline';

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
          <div class="description${task.completed ? ' completed' : ''}" contenteditable="true">${task.description}</div>
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

    function dragTask(index) {
      const task = document.getElementById(`task-${index}`);
      task.draggable = true;
      task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
      });
      task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
      });
    }

    /* eslint-disable no-restricted-syntax, eqeqeq */
    function dropTask(index) {
      const task = document.getElementById(`task-${index}`);
      task.draggable = false;
      const list = document.getElementById('my-list');
      const previousIndex = task.id.split('-')[1];
      let newIndex;
      let counter = 0;
      for (const listItem of list.children) {
        if (listItem.id.split('-')[1] == previousIndex) newIndex = counter;
        counter += 1;
      };
      const movedTask = obj.tasks.splice(previousIndex, 1)[0];
      obj.tasks.splice(newIndex, 0, movedTask);
      obj.updateIndexes();
    }
    /* eslint-enable no-restricted-syntax, eqeqeq */

    function moveTask(y) {
      const list = document.getElementById('my-list');
      const otherTasks = [...list.querySelectorAll('li:not(.dragging):not(.clear-completed)')];
      return otherTasks.reduce((closest, otherTask) => {
        const box = otherTask.getBoundingClientRect();
        const offset = y - box.top - (box.height / 2);
        if (offset < 0 && offset > closest.offset) return { offset, nextTask: otherTask };
        return closest;
      }, { offset: Number.NEGATIVE_INFINITY }).nextTask;
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
          task.description = allowNewline(description.innerHTML);
          obj.updateLocalStorage();
        }, 100);
      });

      // add event listeners for deleting a task
      const binBtn = document.getElementById(`task-${task.index}`).children[2];
      binBtn.addEventListener('click', () => obj.deleteTask(task.index));

      // add event for 'Drag and Drop List items'
      const dragBtn = document.getElementById(`task-${task.index}`).children[3];
      dragBtn.addEventListener('mousedown', () => dragTask(task.index));
      document.getElementById(`task-${task.index}`).addEventListener('dragend', () => dropTask(task.index));
    });

    // add event for 'Clear all completed'
    const clearAllBtn = document.querySelector('.clear-completed');
    clearAllBtn.addEventListener('click', () => obj.clearAllBtn());

    // add event for 'Dragging over the list os tasks'
    const list = document.getElementById('my-list');
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterTask = moveTask(e.clientY);
      const movingTask = document.querySelector('.dragging');
      if (afterTask) {
        list.insertBefore(movingTask, afterTask);
      } else {
        list.insertBefore(movingTask, document.querySelector('.clear-completed'));
      }
    });
  }
}
