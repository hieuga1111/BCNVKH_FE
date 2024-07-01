import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';
import moment from 'moment';

const fillForm = async (page: Page, text: string) => {
	const date = moment().format('DD');
	await page.waitForTimeout(1000);
	await input(page).locator('#name').fill(text);
	await input(page).locator('#code').fill(text);
	await select(page).locator('#warehouseId').fill('h');
	await select(page).locator('#orderIds').fill('7');
	await page.getByTestId('date').first().click();
	await page.getByText(`${date}`).nth(1).click();
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#productId').fill('l');
	await input(page).locator('#quantity').fill('10');
	await input(page).locator('#note').fill(text);
};

const fillFormImport = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#warehouseId').fill('h');
	await select(page).locator('#orderId').fill('a');
	await input(page).locator('#description').fill(text);
};

test.describe.serial('order CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + 'edit';
	const searchText = 'search=' + text;
	const searchEditText = 'search=' + editText;

	// test('01. Create', async ({ page }) => {
	//sign in
	// await page.getByTestId('username').fill('admin');
	// await page.getByTestId('password').fill('admin');
	// await page.getByTestId('submit').click();
	// await page.waitForLoadState('networkidle');
	// 	await page.goto('/warehouse-process/order');

	// 	await page.getByTestId('add-order').click();
	// 	await page.waitForLoadState('networkidle');

	// 	await expect(page).toHaveURL('/warehouse-process/order/create');

	// 	await fillForm(page, text);
	// 	// await page.getByTestId('modal-order-btn').click();

	// 	// await fillModal(page, text);
	// 	// await page.waitForTimeout(1000);

	// 	// await page.getByTestId('submit-modal-btn').click();
	// 	await page.waitForTimeout(1000);

	// 	await page.getByTestId('submit-btn').click();
	// 	await page.waitForLoadState('networkidle');

	// 	await expect(page).toHaveURL('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(text);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.waitForTimeout(1000);
	// 	await page.goto(`/warehouse-process/order?${searchText}`);

	// 	await page.getByTestId('edit-order-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('edit-order-btn')).toBeVisible();
	// });

	// test('02. Edit', async ({ page }) => {
	// 	await page.goto('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(text);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('edit-order-btn').first().click();
	// 	await page.waitForLoadState('networkidle');

	// 	await fillForm(page, editText);
	// 	await page.waitForTimeout(1000);

	// 	await page.getByTestId('submit-btn').click();

	// 	await page.waitForLoadState('networkidle');
	// 	await expect(page).toHaveURL('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.waitForTimeout(1000);
	// 	await page.goto(`/warehouse-process/order?${searchEditText}`);

	// 	await page.getByTestId('edit-order-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('edit-order-btn')).toBeVisible();
	// });

	// test('03. Approve', async ({ page }) => {
	// 	await page.goto('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('detail-order-btn').first().click();
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('submit-order-btn').click();

	// 	await page.waitForLoadState('networkidle');
	// 	await expect(page).toHaveURL('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.waitForTimeout(1000);
	// 	await page.goto(`/warehouse-process/order?${searchEditText}`);

	// 	await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('detail-order-btn')).toBeVisible();
	// });

	test.skip('03. order headApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-order-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-manager-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('04. order managerApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-order-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('05. order administractiveApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-administractive-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('06. order bodApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-bod-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('07. Create export', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/warehousing-bill/export');

		await page.getByTestId('add-export').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/warehousing-bill/export/create');

		await fillFormImport(page, text);
		await page.waitForTimeout(1000);
		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/warehousing-bill/export');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-export-input').fill(text);

		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-export-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-export-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('08. Tally and finish', async ({ page }) => {
		await page.goto('/warehouse-process/warehousing-bill/export');

		await page.getByTestId('search-export-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-export-btn').first().click();
		await page.waitForLoadState('networkidle');

		await fillForm(page, editText);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/warehousing-bill/export');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-export-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-export-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-export-btn')).toBeVisible();
	});
	test.skip('09. export headApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-order-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-manager-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('10. export managerApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-order-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('11. export administractiveApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-administractive-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('12. export bodApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');

		await page.getByTestId('submit').click();

		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-order-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-bod-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/order');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-order-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/order?${searchEditText}`);

		await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-order-btn')).toBeVisible();
	});
});
