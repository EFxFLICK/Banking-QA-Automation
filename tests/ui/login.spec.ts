import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('ParaBank Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('john', 'demo');

    await expect(page).toHaveURL(/.*overview\.htm/);
    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).toBeVisible();
  });
});