/**
 * @jest-environment jsdom
*/

import puppeteer from 'puppeteer';
import path from 'path';
import ToDo from '../todo';

describe('Editing a task description', () => {
  test('should permit the edition of an existing task', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, '../../dist/index.html')}`);
    await page.click('input[name=new-item]');
    await page.type('input[name=new-item]', 'New task for testing!');
    await page.click('input[name=new-item-btn]');
    await page.click('li:nth-last-child(2)>div');
    await page.type('li:nth-last-child(2)>div', ' Editing a task');
    await page.click('h1');
    const lastAddedTask = await page.$eval('li:nth-last-child(2)>div', (el) => el.innerHTML);
    expect(lastAddedTask).toBe('New task for testing! Editing a task');
    setTimeout(() => {
      browser.close();
    }, 2000);
  }, 1000000000);
});

describe('update Completed status', () => {
  test('should update an item\'s \'completed\' status', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, '../../dist/index.html')}`);
    await page.click('input[name=new-item]');
    await page.type('input[name=new-item]', 'New task for testing!');
    await page.click('input[name=new-item-btn]');

    let isCompleted = await page.$eval('li:nth-last-child(2)>input', (el) => el.checked);
    expect(isCompleted).toBe(false);

    await page.click('li:nth-last-child(2) > input');
    await page.goto(`file:${path.join(__dirname, '../../dist/index.html')}`);
    isCompleted = await page.$eval('li:nth-last-child(2)>input', (el) => el.checked);
    expect(isCompleted).toBe(true);
    setTimeout(() => {
      browser.close();
    }, 2000);
  }, 1000000000);
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
