import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Talent Management', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as admin before each test
    await page.goto('/login');
    await loginAsAdmin(page);
    await expect(page.locator('text=Welcome back')).toBeVisible();

    // Navigate to the Talent Management page
    await page.click('text=Talents'); // Assuming there is a navigation link with this text
    await expect(page).toHaveURL('/dashboard/talents'); // Assuming the URL is /dashboard/talents
  });

  test('should create a new talent', async ({ page }) => {
    // Click the "New Talent" button
    await page.click('text=New Talent'); // Assuming the button has this text

    // Fill out the form
    await page.fill('input[name="name"]', 'Test Talent');
    await page.fill('input[name="role"]', 'Developer');
    // Select category (assuming a select dropdown with specific values)
    await page.click('button[aria-label="Select talent category"]'); // Adjust selector as needed
    await page.click('text=TECHNOLOGY'); // Assuming TECHNOLOGY is an option
    await page.fill('textarea[name="bio"]', 'This is a test talent bio.');
    // File upload - This will require more specific implementation based on the FileUpload component
    // For now, we'll skip actual file upload in this basic test structure
    // await page.setInputFiles('input[type="file"]', 'path/to/test/image.jpg');
    // Select status (assuming a select dropdown with specific values)
    await page.click('button[aria-label="Select talent status"]'); // Adjust selector as needed
    await page.click('text=ACTIVE'); // Assuming ACTIVE is an option

    // Click the save button
    await page.click('text=Create Talent'); // Assuming the button has this text

    // Verify the new talent appears in the list (this might require waiting for data to load)
    await expect(page.locator(`text=Test Talent`)).toBeVisible();
  });

  test('should edit an existing talent', async ({ page }) => {
    // Assuming a talent named "Existing Talent" already exists in the database or is created in a "beforeAll" hook
    // Find the row for the existing talent
    const talentRow = page.locator('tr', { hasText: 'Existing Talent' }); // Adjust selector as needed

    // Click the edit button for that talent
    await talentRow.locator('button[aria-label="Edit talent"]').click(); // Adjust selector as needed

    // Verify the edit dialog/form appears
    await expect(page.locator('text=Edit Talent')).toBeVisible(); // Adjust text as needed

    // Fill out the form with updated data
    await page.fill('input[name="role"]', 'Senior Developer');
    // ... update other fields as needed ...
    // File upload update logic would go here

    // Click the save button
    await page.click('text=Save Changes'); // Adjust button text as needed

    // Verify the updated talent information appears in the list
    await expect(talentRow).toContainText('Senior Developer'); // Verify updated role
    // ... verify other updated fields ...
  });

  test('should delete an existing talent', async ({ page }) => {
    // Assuming a talent named "Talent to Delete" already exists or is created
    // Find the row for the talent to delete
    const talentRow = page.locator('tr', { hasText: 'Talent to Delete' }); // Adjust selector as needed

    // Click the delete button for that talent
    await talentRow.locator('button[aria-label="Delete talent"]').click(); // Adjust selector as needed

    // Verify the delete confirmation dialog appears
    await expect(page.locator('text=Confirm Deletion')).toBeVisible(); // Adjust text as needed

    // Click the confirm delete button
    await page.click('text=Delete'); // Adjust button text as needed

    // Verify the talent is removed from the list (this might require waiting for data to update)
    await expect(talentRow).not.toBeVisible();
  });
}); 