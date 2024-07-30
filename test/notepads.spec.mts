import { expect } from '@playwright/test';
import { test } from './utils/test.mts';

import { createNotepad, updateNotepad, deleteNotepad, countNotepads } from './operations/notepads.mts'

/*
  test ids:
    notepad
    notepad-pages-scrolling-area
*/

test('Notepad is added it\'s container when created #EnnXQW3AYD', async ({ launchElectron }) => {
  for await (const page of launchElectron()) {
    const name = 'text:bK5oaojDzQ';
    await createNotepad(page, name);
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[@data-testid='notepad']`
    )).toBeDefined();
  }
});

test('Notepad is modified from it\'s container when updated #KR3ZMLAgsk', async ({ launchElectron }) => {
  for await (const page of launchElectron('KR3ZMLAgsk')) {
    const originalName = 'text:3OxLimFmdA'
    const updatedName = 'text:txg393ydXN'
    await updateNotepad(page, originalName, updatedName);
    // Wait for the page to update
    await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[@data-testid='notepad']`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[@data-testid='notepad']`
    ).count()).toEqual(0);
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${updatedName}')]` +
      `//ancestor::div[@data-testid='notepad']`
    )).toBeDefined();
  }
});

test('Notepad is removed from it\'s container when deleted #qgZ84s8G0C', async ({ launchElectron }) => {
  for await (const page of launchElectron('qgZ84s8G0C')) {
    const name = 'text:vfzbE9RYPL';
    await deleteNotepad(page, name);
    await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[@data-testid='notepad']`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[@data-testid='notepad']`
    ).count()).toEqual(0);
  }
});

test('Notepad container should paginate when there is too many items #5MG57jsx1u', async ({ launchElectron }) => {
  for await (const page of launchElectron('5MG57jsx1u')) {
    await page.locator(
      'xpath=' +
      `//*[contains(text(),'text:FQigMfgR2T')]`
    ).waitFor({state: 'visible'});
    expect(await countNotepads(page)).toEqual(20);
    // Scroll to bottom
    await page.locator(`xpath=//*[@data-testid='notepad-pages-scrolling-area']`).evaluate((node) => {
      node.scrollTo(0, node.scrollHeight);
    });
    await page.locator(
      'xpath=' +
      `//*[contains(text(),'text:sgKR3U3i2Y')]`
    ).waitFor({state: 'visible'});
    expect(await countNotepads(page)).toEqual(25);
  }
});
