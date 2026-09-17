import { test, expect } from '@playwright/test';

test('framework smoke test', async ({ page }) => {
  await page.goto(
    'data:text/html,<html><head><title>Banking QA Framework</title></head><body><h1>Framework Ready</h1></body></html>'
  );

  await expect(page).toHaveTitle('Banking QA Framework');

  await expect(
    page.getByRole('heading', { name: 'Framework Ready' })
  ).toBeVisible();
});