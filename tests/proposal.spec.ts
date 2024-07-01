import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';

const fillForm = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await input(page).locator('#name').fill(text);
	await select(page).locator('#departmentId').fill('Phòng nhân sự');
	await select(page).locator('#warehouseId').fill('h');
	await input(page).locator('#content').fill(text);
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#productId').fill('l');
	await input(page).locator('#quantity').fill('1');
	await input(page).locator('#note').fill(text);
};

const fillFormExport = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#warehouseId').fill('h');
	await select(page).locator('#proposalId').fill(text);
};

const fillFormApproval = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#approverId').fill(text);
	await input(page).locator('#comment').fill(text);
};

const login = async (page: Page, text: string) => {
	await page.goto('/auth/boxed-signin');
	await page.getByTestId('username').fill(text);
	await page.getByTestId('password').fill('admin');
	await page.getByTestId('submit').click();
	await page.waitForLoadState('networkidle');
};

test.skip('proposal CRUD', () => {
	const text = 'yeu cau cap vat tu' + makeRamdomText(5);
	const editText = text + 'edit';
	const searchText = 'search=' + text;
	const searchEditText = 'search=' + editText;

	test('01. Create', async ({ page }) => {
		//sign in
		await login(page, 'proposal');

		await page.goto('/warehouse-process/proposal');

		await page.getByTestId('add-proposal').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/proposal/create');

		await fillForm(page, text);
		await page.getByTestId('modal-proposal-btn').click();

		await fillModal(page, text);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-modal-btn').click();
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/proposal?${searchText}`);

		await page.getByTestId('edit-proposal-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-proposal-btn')).toBeVisible();
	});

	test('02. Edit', async ({ page }) => {
		//sign in
		await login(page, 'proposal');

		await page.goto('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-proposal-btn').first().click();
		await page.waitForLoadState('networkidle');

		await fillForm(page, editText);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(1000);
		await page.goto(`/warehouse-process/proposal?${searchEditText}`);

		await page.getByTestId('edit-proposal-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-proposal-btn')).toBeVisible();
	});

	test('03. proposal send approve step 1', async ({ page }) => {
		//sign in
		await login(page, 'proposal');

		await page.goto('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-proposal-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approval-btn').click();

		await fillFormApproval(page, 'truong phong');
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-modal-btn').click();

		await page.waitForLoadState('networkidle');
	});

	test('04. proposal send approval step 2', async ({ page }) => {
		//sign in
		await login(page, 'head_proposal');

		await page.goto('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-proposal-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approval-btn').click();

		await fillFormApproval(page, 'giam doc');
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-modal-btn').click();

		await page.waitForLoadState('networkidle');
	});

	test.skip('05. proposal approve', async ({ page }) => {
		//sign in
		await login(page, 'manager_proposal');

		await page.goto('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-proposal-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-approve-btn').click();

		await page.waitForLoadState('networkidle');

		await page.locator('.testid-confirm-btn').first().click();

		await page.waitForLoadState('networkidle');

		await page.getByTestId('search-proposal-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-proposal-btn').first().waitFor({ state: 'visible' });
	});

	test.skip('07. Create export', async ({ page }) => {
		//sign in
		await login(page, 'warehousing_export');

		await page.goto('/warehouse-process/warehousing-bill/export');

		await page.getByTestId('add-export').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/warehousing-bill/export/create');

		await fillFormExport(page, 'yeu cau cap vat tu');
		await page.waitForTimeout(1000);
		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/warehousing-bill/export');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-export-input').fill('yeu cau cap vat tu');

		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-export-btn').first().waitFor({ state: 'visible' });
	});

	test.skip('08. Tally and finish', async ({ page }) => {
		await login(page, 'warehousing_export');

		await page.goto('/warehouse-process/warehousing-bill/export');

		await page.getByTestId('search-export-input').fill('yeu cau cap vat tu');
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-export-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('btn-tally').first().click();
		await select(page).locator('#quantity').fill('1');
		await page.getByTestId('btn-quantity').first().click();
		await page.waitForLoadState('networkidle');

		await page.getByTestId('submit-btn').first().click();
		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/warehousing-bill/export');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-export-input').fill('yeu cau cap vat tu');
		await page.waitForLoadState('networkidle');

		await page.getByTestId('detail-export-btn').first().waitFor({ state: 'visible' });
	});
});
