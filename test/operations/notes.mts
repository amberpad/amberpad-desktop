import type { Page } from '@playwright/test';

/*
  test ids:
    add-note-textarea
    add-note-send-button
    note
    note-options-button
    note-options-menu
    note-options-delete-button
    modal-confirm-button
*/

export const createNote = async (
  page: Page,
  content: string,
) => {
    // Set search text into search bar
    await page.locator(`xpath=//*[@data-testid='add-note-textarea']`).fill(content);
    // Click search button
    await page.locator(`xpath=//*[@data-testid='add-note-send-button']`).click();
}

// @data-testid=''
export const deleteNote = async (
  page: Page,
  content: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(),'${content}')]` +
    `//ancestor::*[@data-testid='note']` +
    `//descendant::*[@data-testid='note-options-button']`
  ).click();
  // Click delete option
  await page.locator(
    'xpath=' +
    `//ancestor::*[@data-testid='note-options-menu']` +
    `//descendant::*[@data-testid='note-options-delete-button']` 
  ).click();
  // Click confirm button 
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
}

export const countNotes = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@data-testid='notes-board']` +
    `//descendant::*[@data-testid='note']`
  ).count();
}