import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Security - Authentication', () => {
  test('should reject an invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('john', 'invalid-password');

    await expect(page).not.toHaveURL(/.*overview\.htm/);

    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).not.toBeVisible();
  });

  test('should mask the password field', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  const passwordInput = page.locator('input[name="password"]');

  await expect(passwordInput).toHaveAttribute('type', 'password');
});

test('should reject an invalid username', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('invalid-user', 'demo');

  await expect(page).not.toHaveURL(/.*overview\.htm/);

  await expect(
    page.getByRole('heading', { name: 'Accounts Overview' })
  ).not.toBeVisible();

  await expect(
    page.locator('input[name="username"]')
  ).toBeVisible();
});

});