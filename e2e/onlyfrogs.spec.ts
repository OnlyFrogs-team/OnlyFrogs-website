import { expect, test } from '@playwright/test';

test('migrated Angular app keeps the main OnlyFrogs routes and interactions working', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const externalConsultCalls: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('api.anthropic.com')) {
      externalConsultCalls.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Your frog talisman/i })).toBeVisible();

  await page.getByRole('link', { name: 'Talismans', exact: true }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole('heading', { name: 'Talisman Shop' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.getByRole('button', { name: /1 frogs — View Bag/i })).toBeVisible();
  await page.getByRole('button', { name: /1 frogs — View Bag/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Bag of Frogs' })).toBeVisible();
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.locator('.qty-controls span')).toHaveText('2');
  await page.getByRole('button', { name: 'Close cart' }).last().click();

  await page.getByRole('link', { name: 'Supplies', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Crochet Supplies' })).toBeVisible();
  await page.getByPlaceholder('Search supplies…').fill('Moonlit');
  await expect(page.getByRole('heading', { name: 'Moonlit Silver Yarn' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bog-Green Yarn Bundle' })).toHaveCount(0);

  await page.getByRole('link', { name: 'Tutorials', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Tutorials & Lore' })).toBeVisible();
  await page.getByText('Read tutorial →').click();
  await expect(
    page.locator('.article-modal').getByRole('heading', { name: /Your First Toad/i }),
  ).toBeVisible();
  await page.locator('.article-modal .modal-close').click();

  await page.getByRole('link', { name: 'Community', exact: true }).click();
  await page.getByRole('button', { name: '+ New Thread' }).click();
  await page
    .getByPlaceholder("What's on your mind? (frog-related, ideally)")
    .fill('My frog learned Angular');
  await page.getByRole('button', { name: 'Post Thread' }).click();
  await expect(page.getByRole('heading', { name: 'My frog learned Angular' })).toBeVisible();

  await page.getByLabel('Toggle visual tweaks').click();
  await expect(page.getByRole('heading', { name: 'Tweaks' })).toBeVisible();
  await page.getByLabel('Use accent color #7ecac3').click();

  await page.getByRole('link', { name: /Consult/ }).click();
  await expect(page.getByRole('heading', { name: 'Consult a Frog' })).toBeVisible();
  await page.locator('.personality-card').first().click();
  await page.getByPlaceholder(/Ask Croaker something/).fill('Will my frog prosper?');
  await page.getByRole('button', { name: '↑' }).click();
  await expect(page.getByText(/local consult stub/i)).toBeVisible();

  expect(externalConsultCalls).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
