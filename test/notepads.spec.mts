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
      `//*[@data-testid='notepad']` +
      `//descendant::*[contains(text(), '${name}')]`
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
      `//*[@data-testid='notepad']` +
      `//descendant::*[contains(text(), '${originalName}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='notepad']` +
      `//descendant::*[contains(text(), '${originalName}')]`
    ).count()).toEqual(0);
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='notepad']` +
      `//descendant::*[contains(text(), '${updatedName}')]`
    )).toBeDefined();
  }
});

test('Notepad is removed from it\'s container when deleted #qgZ84s8G0C', async ({ launchElectron }) => {
  for await (const page of launchElectron('qgZ84s8G0C')) {
    const name = 'text:vfzbE9RYPL';
    await deleteNotepad(page, name);
    await page.locator(
      'xpath=' + 
      `//*[@data-testid='notepad']` +
      `//descendant::*[contains(text(), '${name}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='notepad']` +
      `//descendant::*[contains(text(), '${name}')]`
    ).count()).toEqual(0);
  }
});

test('Notepad container should paginate when there is too many items #5MG57jsx1u', async ({ launchElectron }) => {
  for await (const page of launchElectron('5MG57jsx1u')) {
    await expect(async () => {
      await expect(await countNotepads(page)).toEqual(20)
    }).toPass();
    // Scroll to bottom
    await page.locator(
      `xpath=` + 
      `//*[@data-testid='notepads']` +
      `//descendant-or-self::*[@data-testid='inifinite-scroll']`
    ).evaluate((node) => {
      node.scrollTo(0, node.scrollHeight);
    });
    await expect(async () => {
      await expect(await countNotepads(page)).toEqual(25)
    }).toPass();
  }
});
