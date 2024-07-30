import { expect } from '@playwright/test';
import { test } from './utils/test.mts';
import {createNote, deleteNote, countNotes} from './operations/notes.mts';

/*
  test ids:
    notes-board
*/

test('Note is added to note\'s board when created #hJh8yfxfy6', async ({ launchElectron }) => {
  for await (const page of launchElectron()) {
    const textContent = 'text:Og7LikCQFm'
    await createNote(page, textContent);
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='notes-board']` +
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
      `//*[@data-testid='notes-board']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='notes-board']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    ).count()).toEqual(0);
  }
});

test('Notes board should paginate when there is too many items #E1qQS4raeE', async ({ launchElectron }) => {
  for await (const page of launchElectron('E1qQS4raeE')) {
    await expect(async () => {
      await expect(await countNotes(page)).toEqual(20)
    }).toPass();
    await page.locator(
      `xpath=` + 
      `//*[@data-testid='notes-board']` +
      `//descendant-or-self::*[@data-testid='inifinite-scroll']`
    ).evaluate((node) => {
      node.scrollTo(0, 0);
    });
    await expect(async () => {
      await expect(await countNotes(page)).toEqual(25)
    }).toPass();
  }
});