import { expect } from '@playwright/test';
import { test } from './utils/test.mts';
import { createPage, updatePage, deletePage, countPages } from './operations/pages.mts';

test('Page is added to it\'s container when created #0Yu8lf8Q20', async ({ launchElectron }) => {
  for await (const page of launchElectron({
    id: '0Yu8lf8Q20', seed: 'operations/0Yu8lf8Q20'
  })) {
    const notepadName = 'text:oqaTyRWhj5';
    const pageName = 'text:JfJF3rNfom';
    await createPage(page, notepadName, pageName);
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='page']` +
      `//descendant::*[contains(text(), '${pageName}')]`
    )).toBeDefined();
  }
})

test('Page is modified from it\'s container when updated #k8Rzma7uDj', async ({ launchElectron }) => {
  for await (const page of launchElectron({
    id: 'k8Rzma7uDj', seed: 'operations/k8Rzma7uDj'
  })) {
    const originalName = 'text:g5CtZHIxOv';
    const updatedName = 'text:w6XpzCK527';
    await updatePage(page, originalName, updatedName);
    await page.locator(
      'xpath=' + 
      `//*[@data-testid='page']` +
      `//descendant::*[contains(text(), '${originalName}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='page']` +
      `//descendant::*[contains(text(), '${originalName}')]`
    ).count()).toEqual(0);
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='page']` +
      `//descendant::*[contains(text(), '${updatedName}')]`
    )).toBeDefined();
  }
})

test('Page is removed from it\'s container when deleted #CofA5PWDDT', async ({ launchElectron }) => {
  for await (const page of launchElectron({
    id: 'CofA5PWDDT', seed: 'operations/CofA5PWDDT'
  })) {
    const pageName = 'text:T2snrtMcFR'
    await deletePage(page, pageName);
    await page.locator(
      'xpath=' + 
      `//*[@data-testid='page']` +
      `//descendant::*[contains(text(), '${pageName}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[@data-testid='page']` +
      `//descendant::*[contains(text(), '${pageName}')]`
    ).count()).toEqual(0);
  }
})

test('Page containers should paginate when there is too many items #RE7WsTQyCx', async ({ launchElectron }) => {
  for await (const page of launchElectron({
    id: 'RE7WsTQyCx', seed: 'operations/RE7WsTQyCx'
  })) {
    // Wait until there is at least one page in the list
    await expect(async () => {
      await expect(await countPages(page)).toEqual(50)
    }).toPass();
    // Scroll to bottom
    await page.locator(
      `xpath=` + 
      `//*[@data-testid='notepads']`
    ).evaluate((node) => {
      node.scrollTo(0, node.scrollHeight);
    });
    await expect(async () => {
      await expect(await countPages(page)).toEqual(75)
    }).toPass();
  }
});