/**
 * @jest-environment jsdom
*/

import ToDo from '../todo';
import allowNewline from '../allow-newline';

describe('Editing a task description', () => {
  const myToDoListMock = new ToDo();

  beforeEach(() => {
    global.localStorage = {};
    document.body.innerHTML = `
    <h1>A simple list app that is always there for you</h1>
    <div class="container">
      <h2 title="Demo" id="title">Demo</h2>
      <form>
        <input type="text" name="new-item" id="new-item" placeholder="Add to your list...">
        <input type="submit" name="new-item-btn" id="new-item-btn" value="" title="Click this or press <ENTER> to Submit">
      </form>
      <ul id="my-list">
      </ul>
    </div>
  `;
  });

  test('should permit the edition of an existing task', () => {
    const toggleEditModeMock = jest.fn((parent) => {
      parent.classList.toggle('edit-mode');
      parent.children[2].classList.toggle('hidden');
      parent.children[3].classList.toggle('hidden');
    });

    const blurEventMock = jest.fn((description, task) => {
      toggleEditModeMock(description.parentElement);
      task.description = allowNewline(description.innerHTML);
      myToDoListMock.updateLocalStorage();
    });

    myToDoListMock.tasks = [{
      description: 'My first incomplete task',
      completed: false,
      index: 0,
    },
    {
      description: 'My first complete task',
      completed: true,
      index: 1,
    },
    {
      description: 'My second incomplete task',
      completed: false,
      index: 2,
    },
    {
      description: 'My second complete task',
      completed: true,
      index: 3,
    }];

    myToDoListMock.renderList();
    const editingTaskIndex = 0;
    const description = document.getElementById(`task-${editingTaskIndex}`).children[1];
    toggleEditModeMock(description.parentElement);
    expect(description.parentElement.classList).toContain('edit-mode');
    description.innerHTML += ' - editing!';
    blurEventMock(description, myToDoListMock.tasks[editingTaskIndex]);
    expect(myToDoListMock.tasks[editingTaskIndex].description).toBe('My first incomplete task - editing!');
  });
});

describe('update Completed status', () => {
  const myToDoListMock = new ToDo();

  beforeEach(() => {
    global.localStorage = {};
    document.body.innerHTML = `
    <h1>A simple list app that is always there for you</h1>
    <div class="container">
      <h2 title="Demo" id="title">Demo</h2>
      <form>
        <input type="text" name="new-item" id="new-item" placeholder="Add to your list...">
        <input type="submit" name="new-item-btn" id="new-item-btn" value="" title="Click this or press <ENTER> to Submit">
      </form>
      <ul id="my-list">
      </ul>
    </div>
  `;
  });
  test('should update an item\'s \'completed\' status', () => {
    const toggleCompletedModeMock = jest.fn((el) => {
      const index = el.parentElement.id.split('-')[1];
      myToDoListMock.tasks[index].completed = !myToDoListMock.tasks[index].completed;
      document.getElementById(`task-${index}`).children[1].classList.toggle('completed');
      myToDoListMock.updateLocalStorage();
    });

    myToDoListMock.tasks = [{
      description: 'My first incomplete task',
      completed: false,
      index: 0,
    },
    {
      description: 'My first complete task',
      completed: true,
      index: 1,
    },
    {
      description: 'My second incomplete task',
      completed: false,
      index: 2,
    },
    {
      description: 'My second complete task',
      completed: true,
      index: 3,
    }];
    myToDoListMock.renderList();
    const updateTaskIndex = 0;
    const checkboxMock = document.getElementById(`task-${updateTaskIndex}`).children[0];
    expect(myToDoListMock.tasks[updateTaskIndex].completed).toBe(false);
    toggleCompletedModeMock(checkboxMock);
    expect(myToDoListMock.tasks[updateTaskIndex].completed).toBe(true);
  });
});

describe('clearAll completed', () => {
  const myToDoListMock = new ToDo();

  beforeEach(() => {
    global.localStorage = {};
    document.body.innerHTML = `
    <h1>A simple list app that is always there for you</h1>
    <div class="container">
      <h2 title="Demo" id="title">Demo</h2>
      <form>
        <input type="text" name="new-item" id="new-item" placeholder="Add to your list...">
        <input type="submit" name="new-item-btn" id="new-item-btn" value="" title="Click this or press <ENTER> to Submit">
      </form>
      <ul id="my-list">
      </ul>
    </div>
  `;
  });

  test('should exist', () => {
    expect(myToDoListMock.clearAllBtn).toBeDefined();
  });

  test('should clear all completed', () => {
    myToDoListMock.tasks = [{
      description: 'My first incomplete task',
      completed: false,
      index: 0,
    },
    {
      description: 'My first complete task',
      completed: true,
      index: 1,
    },
    {
      description: 'My second incomplete task',
      completed: false,
      index: 2,
    },
    {
      description: 'My second complete task',
      completed: true,
      index: 3,
    }];
    expect(myToDoListMock.tasks.length).toBe(4);
    myToDoListMock.clearAllBtn();
    expect(myToDoListMock.tasks.length).toBe(2);
  });
});

describe('updateIndexes() method', () => {
  const myToDoListMock = new ToDo();

  beforeEach(() => {
    global.localStorage = {};
    document.body.innerHTML = `
    <h1>A simple list app that is always there for you</h1>
    <div class="container">
      <h2 title="Demo" id="title">Demo</h2>
      <form>
        <input type="text" name="new-item" id="new-item" placeholder="Add to your list...">
        <input type="submit" name="new-item-btn" id="new-item-btn" value="" title="Click this or press <ENTER> to Submit">
      </form>
      <ul id="my-list">
      </ul>
    </div>
  `;
  });

  test('should exist', () => {
    expect(myToDoListMock.updateIndexes).toBeDefined();
  });

  test('should update an item\'s index property upon drag/drop actions', () => {
    myToDoListMock.tasks = [{
      description: 'My first incomplete task',
      completed: false,
      index: 0,
    },
    {
      description: 'My first complete task',
      completed: true,
      index: 1,
    },
    {
      description: 'My second incomplete task',
      completed: false,
      index: 2,
    },
    {
      description: 'My second complete task',
      completed: true,
      index: 3,
    }];
    [myToDoListMock.tasks[0], myToDoListMock.tasks[1]] = [
      myToDoListMock.tasks[1],
      myToDoListMock.tasks[0],
    ];
    myToDoListMock.updateIndexes();
    let counterIndex = 0;
    myToDoListMock.tasks.forEach((task) => {
      expect(task.index).toBe(counterIndex);
      counterIndex += 1;
    });
  });
});
