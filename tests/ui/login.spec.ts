import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { bankingTestData } from '../../test-data/banking-test-data';


test.describe('ParaBank Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      bankingTestData.user.username,
     bankingTestData.user.password
    );
    await expect(page).toHaveURL(/.*overview\.htm/);
    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).toBeVisible();
  });
});