import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';

const fillForm = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await input(page).locator('#vehicleRegistrationNumber').fill(text);
	await select(page).locator('#repairById').fill('a');
	await input(page).locator('#customerName').fill(text);
	await input(page).locator('#description').fill(text);
	await input(page).locator('#damageLevel').fill(text);
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#replacementPartId').fill('l');
	await input(page).locator('#quantity').fill('10');
	await input(page).locator('#brokenPart').fill(text);
	await input(page).locator('#note').fill(text);
};

const fillFormExport = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#warehouseId').fill('h');
	await select(page).locator('#orderId').fill('a');
	await input(page).locator('#description').fill(text);
};

test.describe.serial('repair CRUD', () => {
	const text = 'yeu cau sua chua' + makeRamdomText(5);
	const editText = text + 'edit';
	const searchText = 'search=' + text;
	const searchEditText = 'search=' + editText;

	test.skip('01. Create', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');
		
		await page.goto('/warehouse-process/repair');

		await page.getByTestId('add-repair').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/repair/create');

		await fillForm(page, text);
		await page.getByTestId('modal-repair-btn').click();

		await fillModal(page, text);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-modal-btn').click();
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchText}`);

		await page.getByTestId('edit-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-repair-btn')).toBeVisible();
	});

	test.skip('02. Edit', async ({ page }) => {
		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await fillForm(page, editText);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('edit-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-repair-btn')).toBeVisible();
	});

	test.skip('03. repair headApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-repair-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-manager-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('04. repair managerApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-repair-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('05. repair administractiveApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-administractive-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('06. repair bodApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-bod-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

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

		await fillFormExport(page, text);
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
	});

	test.skip('08. Tally and finish', async ({ page }) => {
		await page.goto('/warehouse-process/warehousing-bill/export');

		await page.getByTestId('search-export-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-export-btn').first().click();
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

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});
	test.skip('09. export headApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-repair-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-manager-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('10. export managerApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-repair-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('11. export administractiveApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-administractive-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();

		//sign out
		await page.getByTestId('sign-out-btn').first().click();
	});

	test.skip('12. export bodApprove', async ({ page }) => {
		//sign in
		await page.getByTestId('username').fill('admin');
		await page.getByTestId('password').fill('admin');
		await page.getByTestId('submit').click();
		await page.waitForLoadState('networkidle');

		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-bod-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/repair?${searchEditText}`);

		await page.getByTestId('detail-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('detail-repair-btn')).toBeVisible();
	});
});
