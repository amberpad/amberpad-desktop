import { expect } from '@playwright/test';
import { test } from './utils/test';
import {createNote, deleteNote, countNotes} from './operations/notes';

test('Note is added to note\'s board when created #hJh8yfxfy6', async ({ launchElectron }) => {
  for await (const page of launchElectron()) {
    const textContent = 'text:Og7LikCQFm'
    await createNote(page, textContent);
    expect(await page.locator(
      'xpath=' + 
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    )).toBeDefined();
  }
});

test('Note is deleted when delete\'s operation is confirmed #HbHdvSxtjY', async ({ launchElectron }) => {
  for await (const page of launchElectron('HbHdvSxtjY')) {
    const textContent = 'text:NXIdNyzgq9';
    await deleteNote(page, textContent);
    await page.locator(
      'xpath=' + 
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    ).count()).toEqual(0);
  }
});

test.only('Notes board should paginate when there is too many items #E1qQS4raeE', async ({ launchElectron }) => {
  for await (const page of launchElectron('E1qQS4raeE')) {
    await page.locator(
      'xpath=' +
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'text:teoGsC8JN6')]`
    ).waitFor({state: 'visible'});
    expect(await countNotes(page)).toEqual(20);
    // Scroll to bottom
    await page.locator(`xpath=//*[@id='id:notes-board:Y8FAln8HKV']`).evaluate((node) => {
      node.scrollTo(0, 0);
    });
    await page.locator(
      'xpath=' +
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'text:V5BfHdvxKv')]`
    ).waitFor({state: 'visible'});
    expect(await countNotes(page)).toEqual(25);
  }
});