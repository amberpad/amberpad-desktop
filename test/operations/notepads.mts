import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/*
  data-testid:
    - create-notepad-button
    - notepad-modal-name-input
    - modal-confirm-button

    - notepad-options-button
    - notepad-options-edit-notepad-button
    - notepad-options-delete-notepad-button
*/


export const createNotepad = async (
  page: Page,
  name: string,
) => {
  await page.locator(
    'xpath=' +
    `//*[@data-testid='create-notepad-button']`
  ).click();
  await page.locator(
    'xpath=' +
    `//*[@data-testid='notepad-modal-name-input']` +
    `//descendant-or-self::input`
  ).fill(name);
  // Click confirm button
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
};

export const updateNotepad = async (
  page: Page,
  name: string,
  newName: string,
) => {
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` + // Notepad text element
    `//ancestor::*[@data-testid='notepad']` + // Notepad element
    `//descendant::*[@data-testid='notepad-options-button']` // Options button
  ).click();
  await page.locator(
    'xpath=' +
    `//ancestor::*[@data-testid='notepad-options-menu']` +
    `//descendant::*[@data-testid='notepad-options-edit-notepad-button']`
  ).click();
  await page.locator(
    'xpath=' +
    `//*[@data-testid='notepad-modal-name-input']` +
    `//descendant-or-self::input`
  ).fill(newName);
  // Click confirm button
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
};

export const deleteNotepad = async (
  page: Page,
  name: string,
) => {
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` + // Notepad text element
    `//ancestor::*[@data-testid='notepad']` + // Notepad element
    `//descendant::*[@data-testid='notepad-options-button']` // Options button
  ).click();
  await page.locator(
    'xpath=' +
    `//ancestor::*[@data-testid='notepad-options-menu']` +
    `//descendant::*[@data-testid='notepad-options-delete-notepad-button']`
  ).click();
  await page.locator(`xpath=//*[@data-testid='modal-confirm-button']`).click();
};

export const countNotepads = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@data-testid='notepads']` +
    `//descendant::*[@data-testid='notepad']`
  ).count();
};