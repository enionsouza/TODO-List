/**
 * @jest-environment jsdom
*/

import ToDo from '../todo';

describe('Editing a task description', () => {
  test.skip('should permit the edition of an existing task', () => {
});

describe('update Completed status', () => {
  test.skip('should update an item\'s \'completed\' status', () => {

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
