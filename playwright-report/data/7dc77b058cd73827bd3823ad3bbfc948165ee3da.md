# Test info

- Name: Contact Form >> should submit contact form successfully
- Location: C:\Users\shmes\Desktop\torch-group\e2e\contact.test.ts:4:7

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /send/i })
    - locator resolved to <button disabled type="submit" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground h-9 px-4 has-[>s…>…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    14 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

    at C:\Users\shmes\Desktop\torch-group\e2e\contact.test.ts:19:55
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
- banner:
  - navigation:
    - link "Torch Logo Torch":
      - /url: /
      - img "Torch Logo"
      - text: Torch
    - link "Home":
      - /url: /
    - link "About":
      - /url: /about
    - link "Services":
      - /url: /services
    - link "Blog":
      - /url: /blog
    - link "Contact":
      - /url: /contact
- main:
  - main:
    - heading "Get In Touch" [level=1]
    - paragraph: We'd love to hear from you. Whether you have a question about our services, want to partner, or just want to say hello, feel free to reach out.
    - heading "Contact Information" [level=2]
    - text: info@torchgroup.com +1 (123) 456-7890 123 Digital Way Innovation City, IC 98765 Country
    - link "Facebook":
      - /url: https://facebook.com/torchgroup
    - link "Instagram":
      - /url: https://instagram.com/torchgroup
    - link "Twitter":
      - /url: https://twitter.com/torchgroup
    - link "LinkedIn":
      - /url: https://linkedin.com/company/torchgroup
    - heading "Send us a Message" [level=2]
    - text: Name
    - textbox "Name": Test User
    - text: Email
    - textbox "Email": test@example.com
    - text: Phone Number
    - combobox "Phone number country":
      - option "International" [selected]
      - option "Afghanistan"
      - option "Åland Islands"
      - option "Albania"
      - option "Algeria"
      - option "American Samoa"
      - option "Andorra"
      - option "Angola"
      - option "Anguilla"
      - option "Antigua and Barbuda"
      - option "Argentina"
      - option "Armenia"
      - option "Aruba"
      - option "Ascension Island"
      - option "Australia"
      - option "Austria"
      - option "Azerbaijan"
      - option "Bahamas"
      - option "Bahrain"
      - option "Bangladesh"
      - option "Barbados"
      - option "Belarus"
      - option "Belgium"
      - option "Belize"
      - option "Benin"
      - option "Bermuda"
      - option "Bhutan"
      - option "Bolivia"
      - option "Bonaire, Sint Eustatius and Saba"
      - option "Bosnia and Herzegovina"
      - option "Botswana"
      - option "Brazil"
      - option "British Indian Ocean Territory"
      - option "Brunei Darussalam"
      - option "Bulgaria"
      - option "Burkina Faso"
      - option "Burundi"
      - option "Cambodia"
      - option "Cameroon"
      - option "Canada"
      - option "Cape Verde"
      - option "Cayman Islands"
      - option "Central African Republic"
      - option "Chad"
      - option "Chile"
      - option "China"
      - option "Christmas Island"
      - option "Cocos (Keeling) Islands"
      - option "Colombia"
      - option "Comoros"
      - option "Congo"
      - option "Congo, Democratic Republic of the"
      - option "Cook Islands"
      - option "Costa Rica"
      - option "Cote d'Ivoire"
      - option "Croatia"
      - option "Cuba"
      - option "Curaçao"
      - option "Cyprus"
      - option "Czech Republic"
      - option "Denmark"
      - option "Djibouti"
      - option "Dominica"
      - option "Dominican Republic"
      - option "Ecuador"
      - option "Egypt"
      - option "El Salvador"
      - option "Equatorial Guinea"
      - option "Eritrea"
      - option "Estonia"
      - option "Ethiopia"
      - option "Falkland Islands"
      - option "Faroe Islands"
      - option "Federated States of Micronesia"
      - option "Fiji"
      - option "Finland"
      - option "France"
      - option "French Guiana"
      - option "French Polynesia"
      - option "Gabon"
      - option "Gambia"
      - option "Georgia"
      - option "Germany"
      - option "Ghana"
      - option "Gibraltar"
      - option "Greece"
      - option "Greenland"
      - option "Grenada"
      - option "Guadeloupe"
      - option "Guam"
      - option "Guatemala"
      - option "Guernsey"
      - option "Guinea"
      - option "Guinea-Bissau"
      - option "Guyana"
      - option "Haiti"
      - option "Holy See (Vatican City State)"
      - option "Honduras"
      - option "Hong Kong"
      - option "Hungary"
      - option "Iceland"
      - option "India"
      - option "Indonesia"
      - option "Iran"
      - option "Iraq"
      - option "Ireland"
      - option "Isle of Man"
      - option "Israel"
      - option "Italy"
      - option "Jamaica"
      - option "Japan"
      - option "Jersey"
      - option "Jordan"
      - option "Kazakhstan"
      - option "Kenya"
      - option "Kiribati"
      - option "Kosovo"
      - option "Kuwait"
      - option "Kyrgyzstan"
      - option "Laos"
      - option "Latvia"
      - option "Lebanon"
      - option "Lesotho"
      - option "Liberia"
      - option "Libya"
      - option "Liechtenstein"
      - option "Lithuania"
      - option "Luxembourg"
      - option "Macao"
      - option "Madagascar"
      - option "Malawi"
      - option "Malaysia"
      - option "Maldives"
      - option "Mali"
      - option "Malta"
      - option "Marshall Islands"
      - option "Martinique"
      - option "Mauritania"
      - option "Mauritius"
      - option "Mayotte"
      - option "Mexico"
      - option "Moldova"
      - option "Monaco"
      - option "Mongolia"
      - option "Montenegro"
      - option "Montserrat"
      - option "Morocco"
      - option "Mozambique"
      - option "Myanmar"
      - option "Namibia"
      - option "Nauru"
      - option "Nepal"
      - option "Netherlands"
      - option "New Caledonia"
      - option "New Zealand"
      - option "Nicaragua"
      - option "Niger"
      - option "Nigeria"
      - option "Niue"
      - option "Norfolk Island"
      - option "North Korea"
      - option "North Macedonia"
      - option "Northern Mariana Islands"
      - option "Norway"
      - option "Oman"
      - option "Pakistan"
      - option "Palau"
      - option "Palestine"
      - option "Panama"
      - option "Papua New Guinea"
      - option "Paraguay"
      - option "Peru"
      - option "Philippines"
      - option "Poland"
      - option "Portugal"
      - option "Puerto Rico"
      - option "Qatar"
      - option "Reunion"
      - option "Romania"
      - option "Russia"
      - option "Rwanda"
      - option "Saint Barthélemy"
      - option "Saint Helena"
      - option "Saint Kitts and Nevis"
      - option "Saint Lucia"
      - option "Saint Martin (French Part)"
      - option "Saint Pierre and Miquelon"
      - option "Saint Vincent and the Grenadines"
      - option "Samoa"
      - option "San Marino"
      - option "Sao Tome and Principe"
      - option "Saudi Arabia"
      - option "Senegal"
      - option "Serbia"
      - option "Seychelles"
      - option "Sierra Leone"
      - option "Singapore"
      - option "Sint Maarten"
      - option "Slovakia"
      - option "Slovenia"
      - option "Solomon Islands"
      - option "Somalia"
      - option "South Africa"
      - option "South Korea"
      - option "South Sudan"
      - option "Spain"
      - option "Sri Lanka"
      - option "Sudan"
      - option "Suriname"
      - option "Svalbard and Jan Mayen"
      - option "Swaziland"
      - option "Sweden"
      - option "Switzerland"
      - option "Syria"
      - option "Taiwan"
      - option "Tajikistan"
      - option "Tanzania"
      - option "Thailand"
      - option "Timor-Leste"
      - option "Togo"
      - option "Tokelau"
      - option "Tonga"
      - option "Trinidad and Tobago"
      - option "Tristan da Cunha"
      - option "Tunisia"
      - option "Turkey"
      - option "Turkmenistan"
      - option "Turks and Caicos Islands"
      - option "Tuvalu"
      - option "Uganda"
      - option "Ukraine"
      - option "United Arab Emirates"
      - option "United Kingdom"
      - option "United States"
      - option "Uruguay"
      - option "Uzbekistan"
      - option "Vanuatu"
      - option "Venezuela"
      - option "Vietnam"
      - option "Virgin Islands, British"
      - option "Virgin Islands, U.S."
      - option "Wallis and Futuna"
      - option "Western Sahara"
      - option "Yemen"
      - option "Zambia"
      - option "Zimbabwe"
    - textbox "Enter phone number": +1 234 567 890
    - button [disabled]
    - text: Subject
    - textbox "Subject": Test Subject
    - text: Message
    - textbox "Message": This is a test message
    - text: Attachment (Optional)
    - img
    - text: Loading...
    - button "Loading..." [disabled]
    - checkbox "I agree to the Privacy Policy" [checked]
    - text: I agree to the
    - link "Privacy Policy":
      - /url: /privacy
    - button "Send Message" [disabled]
- contentinfo:
  - img "Torch Logo"
  - navigation "Footer":
    - link "About":
      - /url: /about
    - link "Services":
      - /url: /services
    - link "Blog":
      - /url: /blog
    - link "Contact":
      - /url: /contact
  - link "Facebook":
    - /url: https://facebook.com/torchgroup
  - link "Instagram":
    - /url: https://instagram.com/torchgroup
  - link "Twitter":
    - /url: https://twitter.com/torchgroup
  - link "LinkedIn":
    - /url: https://linkedin.com/company/torchgroup
  - paragraph: © 2025 Torch Group. All rights reserved.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Contact Form', () => {
   4 |   test('should submit contact form successfully', async ({ page }) => {
   5 |     await page.goto('/contact');
   6 |
   7 |     // Fill out the form
   8 |     await page.getByLabel(/name/i).fill('Test User');
   9 |     await page.getByLabel(/email/i).fill('test@example.com');
   10 |     // Use the phone input field instead of the country dropdown
   11 |     await page.locator('input[name="phone"]').fill('+1234567890');
   12 |     await page.getByLabel(/subject/i).fill('Test Subject');
   13 |     await page.getByLabel(/message/i).fill('This is a test message');
   14 |     
   15 |     // Accept privacy policy
   16 |     await page.getByLabel(/privacy policy/i).check();
   17 |
   18 |     // Submit the form
>  19 |     await page.getByRole('button', { name: /send/i }).click();
      |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
   20 |
   21 |     // Check for success message or toast
   22 |     await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 10000 });
   23 |   });
   24 |
   25 |   test('should show validation errors', async ({ page }) => {
   26 |     await page.goto('/contact');
   27 |
   28 |     // Submit empty form
   29 |     await page.getByRole('button', { name: /send/i }).click();
   30 |
   31 |     // Check for validation errors
   32 |     await expect(page.getByText(/name is required/i)).toBeVisible();
   33 |     await expect(page.getByText(/email is required/i)).toBeVisible();
   34 |     await expect(page.getByText(/subject is required/i)).toBeVisible();
   35 |     await expect(page.getByText(/message must be at least/i)).toBeVisible();
   36 |     await expect(page.getByText(/privacy policy/i)).toBeVisible();
   37 |   });
   38 |
   39 |   test('should handle phone verification', async ({ page }) => {
   40 |     await page.goto('/contact');
   41 |
   42 |     // Fill form except phone
   43 |     await page.getByLabel(/name/i).fill('Test User');
   44 |     await page.getByLabel(/email/i).fill('test@example.com');
   45 |     await page.getByLabel(/subject/i).fill('Test Subject');
   46 |     await page.getByLabel(/message/i).fill('Test message');
   47 |     await page.getByLabel(/privacy policy/i).check();
   48 |
   49 |     // Enter valid phone
   50 |     await page.locator('input[name="phone"]').fill('+1234567890');
   51 |     
   52 |     // Request verification code - look for the send button next to phone input
   53 |     await page.getByRole('button', { name: /send/i }).first().click();
   54 |     
   55 |     // Check for verification code input
   56 |     await expect(page.getByLabel(/verification code/i)).toBeVisible({ timeout: 5000 });
   57 |     
   58 |     // Enter verification code
   59 |     await page.getByLabel(/verification code/i).fill('123456');
   60 |     
   61 |     // Verify the code
   62 |     await page.getByRole('button').filter({ hasText: /verify/i }).click();
   63 |     
   64 |     // Check for verification success
   65 |     await expect(page.getByText(/phone number verified/i)).toBeVisible();
   66 |   });
   67 |
   68 |   test('should submit contact form with file upload', async ({ page }) => {
   69 |     await page.goto('/contact');
   70 |
   71 |     // Fill out the form
   72 |     await page.getByLabel(/name/i).fill('Test User');
   73 |     await page.getByLabel(/email/i).fill('test@example.com');
   74 |     await page.locator('input[name="phone"]').fill('+1234567890');
   75 |     await page.getByLabel(/subject/i).fill('Test Subject');
   76 |     await page.getByLabel(/message/i).fill('This is a test message with file');
   77 |     await page.getByLabel(/privacy policy/i).check();
   78 |
   79 |     // Upload a file - look for the file upload component
   80 |     const fileChooserPromise = page.waitForEvent('filechooser');
   81 |     // Click on the file upload area
   82 |     await page.locator('[data-testid="file-upload"], .ut-dropzone, [role="button"]:has-text("Choose files")').first().click();
   83 |     const fileChooser = await fileChooserPromise;
   84 |     await fileChooser.setFiles('e2e/helpers/test-upload.pdf');
   85 |
   86 |     // Wait for upload to complete
   87 |     await expect(page.getByText(/upload complete/i)).toBeVisible({ timeout: 10000 });
   88 |
   89 |     // Submit the form
   90 |     await page.getByRole('button', { name: /send message/i }).click();
   91 |
   92 |     // Check for success message
   93 |     await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 10000 });
   94 |   });
   95 |
   96 |   test('should handle API error on form submission', async ({ page }) => {
   97 |     await page.goto('/contact');
   98 |
   99 |     // Fill out the form
  100 |     await page.getByLabel(/name/i).fill('Test User');
  101 |     await page.getByLabel(/email/i).fill('test@example.com');
  102 |     await page.locator('input[name="phone"]').fill('+1234567890');
  103 |     await page.getByLabel(/subject/i).fill('Test Subject');
  104 |     await page.getByLabel(/message/i).fill('This is a test message');
  105 |     await page.getByLabel(/privacy policy/i).check();
  106 |
  107 |     // Mock API error
  108 |     await page.route('/api/contact', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
  109 |
  110 |     // Submit the form
  111 |     await page.getByRole('button', { name: /send message/i }).click();
  112 |
  113 |     // Check for error message or toast
  114 |     await expect(page.getByText(/error/i)).toBeVisible({ timeout: 5000 });
  115 |   });
  116 | }); 
```