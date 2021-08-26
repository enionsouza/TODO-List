/**
 * @jest-environment jsdom
 */

import ToDo from '../todo';

describe('addTask', () => {
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
    // Arrange
    const myToDoListMock = new ToDo();

    // Act and Assert
    expect(myToDoListMock.addTask).toBeDefined();
  });

  test('should NOT add an empty Task', () => {
    // Arrange
    const myToDoListMock = new ToDo();

    // Act
    myToDoListMock.addTask('');

    // Assert
    expect(myToDoListMock.tasks.length).toBe(0);
  });

  test('should add a new valid Task', () => {
    // Arrange
    const myToDoListMock = new ToDo();

    // Act
    myToDoListMock.addTask('New Task');

    // Assert
    expect(myToDoListMock.tasks.length).toBe(1);
  });
});
