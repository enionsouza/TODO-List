/**
 * @jest-environment jsdom
 */

import ToDo from '../todo';

// Arrange

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

describe('addTask', () => {
  test('should exist', () => {
    // Act and Assert
    expect(myToDoListMock.addTask).toBeDefined();
  });

  test('should NOT add an empty Task', () => {
    // Act
    myToDoListMock.addTask('');

    // Assert
    expect(myToDoListMock.tasks.length).toBe(0);
  });

  test('should add a new valid Task', () => {
    // Act
    myToDoListMock.addTask('New Task');

    // Assert
    expect(myToDoListMock.tasks.length).toBe(1);
  });
});

describe('deleteTask', () => {
  test('should exist', () => {
    // Act and Assert
    expect(myToDoListMock.deleteTask).toBeDefined();
  });

  test('should delete a Task', () => {
    // Arrange
    myToDoListMock.addTask('Task to be deleted');
    const taskLength = myToDoListMock.tasks.length;
    // Act
    myToDoListMock.deleteTask(0);

    // Assert
    expect(myToDoListMock.tasks.length).toBe(taskLength - 1);
  });
});