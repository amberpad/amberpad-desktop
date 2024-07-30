import type { Page } from '@playwright/test';

/*
  data-testids: 
    notepad
    notepad-options-button
    notepad-options-menu
    notepad-options-create-page-button
    page-options-button
    page-options-menu
    page-options-edit-page-button
    page-options-delete-page-button
    page-modal-name-input
    modal-confirm-button
*/

export const createPage = async (
  page: Page,
  notepadName: string,
  name: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::*[@data-testid='notepad']` + // Notepad element
    `//descendant::*[@data-testid='notepad-options-button']` // Options button
  ).click();
  // Click create page option
  await page.locator(
    'xpath=' +
    `//ancestor::*[@data-testid='notepad-options-menu']` +
    `//descendant::*[@data-testid='notepad-options-create-page-button']` // Create Page button
  ).click();
  await page.locator(
    'xpath=' +
    `//*[@data-testid='page-modal-name-input']` +
    `//descendant-or-self::input`
  ).fill(name);
  // Click confirm button
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
}

export const updatePage = async (
  page: Page,
  name: string,
  newName: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[@data-testid='page']` +
    `//descendant::*[@data-testid='page-options-button']`
  ).click();
  // Click edit page option
  await page.locator(
    'xpath=' +
    `//*[@data-testid='page-options-menu']` + 
    `//descendant::*[@data-testid='page-options-edit-page-button']`
  ).click();
  await page.locator(
    'xpath=' +
    `//*[@data-testid='page-modal-name-input']` +
    `//descendant-or-self::input`
  ).fill(newName);
  // Click confirm button
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
}

export const deletePage = async (
  page: Page,
  name: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[@data-testid='page']` +
    `//descendant::*[@data-testid='page-options-button']`
  ).click();
  // Click delete page option
  await page.locator(
    'xpath=' +
    `//ancestor::*[@data-testid='page-options-menu']` +
    `//descendant::*[@data-testid='page-options-delete-page-button']`
  ).click();
  // Click confirm button
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
}

export const countPages = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@data-testid='notepad-pages-scrolling-area']` +
    `//descendant::*[@data-testid='page']`
  ).count();
}
