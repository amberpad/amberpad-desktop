import type { Page } from '@playwright/test';

export const createNotepad = async (
  page: Page,
  name: string,
) => {
  // Click create notepad button
  await page.locator(`xpath=//*[@id='id:create-notepad-button:f9CFxx4pON']`).click();
  // Fill notepad name input
  await page.locator(
    'xpath=' +
    '//div[contains(@class, \'class:create-notepad-name-input:hWmi28rONe\')]' +
    '//descendant::input'
  ).fill(name);
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
};

export const updateNotepad = async (
  page: Page,
  name: string,
  newName: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]`
  ).click();
  // Click edit option
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-edit-button:OJSSF5T46S')]`
  ).click();
  // Set new name on name's input
  await page.locator(
    'xpath=' +
    `//div[contains(@class, 'class:create-notepad-name-input:hWmi28rONe')]` +
    `//descendant::input`
  ).fill(newName);
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
};

export const deleteNotepad = async (
  page: Page,
  name: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]`
  ).click();
  // Click delete option
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-delete-button:r6ukcuDrQL')]`
  ).click();
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
};

export const countNotepads = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
  ).count();
};