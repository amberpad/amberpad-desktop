import { expect } from '@playwright/test';
import { test } from './utils/test.mts';
import type { Page } from '@playwright/test';

import { countNotes } from './operations/notes.mts';
import { countNotepads } from './operations/notepads.mts';
import { countPages } from './operations/pages.mts';

/*
  data-testid:
    - searchbar-input
    - searchbar-send-button
    - searchbar-clear-button
*/

const search = async (
  page: Page,
  content: string,
) => {
  // Set search text into search bar
  await page.locator(
    `xpath=` + 
    `//*[contains(@data-testid, 'searchbar')]` +
    `//descendant-or-self::input`
  ).fill(content);
  // Click search button
  await page.locator(
    `xpath=` + 
    `//*[contains(@data-testid, 'searchbar-send-button')]`
  ).click();
}

const clearSearch = async (
  page: Page,
) => {
  // Click clear search button
  await page.locator(
    `xpath=` + 
    `//*[contains(@data-testid, 'searchbar-clear-button')]`
  ).click();
}

test('Search should filter items by its keywords #6LGdgVNDb0', async ({ launchElectron }) => {
  for await (const page of launchElectron('6LGdgVNDb0')) {
    // Search for multiple items
    await search(page, 'text');
    expect(await countNotepads(page)).toEqual(5);
    expect(await countPages(page)).toEqual(5);
    expect(await countNotes(page)).toEqual(5);
    // Search for specific item
    await search(page, 'text:jq7UI8KMvB');
    expect(await countNotepads(page)).toEqual(1);
    expect(await countPages(page)).toEqual(1);
    expect(await countNotes(page)).toEqual(1);
    await clearSearch(page);
    expect(await countNotepads(page)).toEqual(5);
    expect(await countPages(page)).toEqual(5);
    expect(await countNotes(page)).toEqual(5);
  }

});
