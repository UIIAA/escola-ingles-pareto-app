import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should display login form correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check if login form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible();

    // Check for form validation
    await expect(page.locator('form')).toBeVisible();
  });

  test('should display registration form correctly', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');

    // Check if registration form elements are present
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /cadastrar|register/i })).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');

    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=/email.*inválido|invalid.*email/i')).toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/register');

    // Fill form with short password
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');

    // Should show password validation error
    await expect(page.locator('text=/senha.*6.*caracteres|password.*6.*characters/i')).toBeVisible();
  });

  test('should redirect to login from register page', async ({ page }) => {
    await page.goto('/register');

    // Find and click login link
    await page.click('text=/já.*conta|already.*account/i');

    // Should be on login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect to register from login page', async ({ page }) => {
    await page.goto('/login');

    // Find and click register link
    await page.click('text=/criar.*conta|create.*account/i');

    // Should be on register page
    await expect(page).toHaveURL(/.*\/register/);
  });

  test('should handle login attempt with test credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form with admin credentials
    await page.fill('input[type="email"]', 'admin@paretoingles.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Should either redirect to dashboard or show loading state
    await page.waitForTimeout(2000);

    // Check if we're redirected or if there's an error message
    const currentUrl = page.url();
    const hasError = await page.locator('text=/erro|error/i').isVisible();

    if (!hasError) {
      // If no error, should be redirected away from login page
      expect(currentUrl).not.toContain('/login');
    }
  });

  test('should protect admin routes when not authenticated', async ({ page }) => {
    // Try to access admin page directly
    await page.goto('/admin');

    // Should be redirected to login or show auth error
    await page.waitForTimeout(1000);
    const currentUrl = page.url();

    // Should either be on login page or home page (not admin)
    expect(currentUrl).not.toContain('/admin');
  });

  test('should show loading states during authentication', async ({ page }) => {
    await page.goto('/login');

    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click submit and check for loading state
    await page.click('button[type="submit"]');

    // Should show loading indicator (spinner, disabled button, etc.)
    const loadingIndicator = page.locator('[data-loading="true"], .loading, button:disabled, .spinner');
    await expect(loadingIndicator).toBeVisible();
  });
});