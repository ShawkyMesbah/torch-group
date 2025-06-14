# Test info

- Name: Contact Form >> should handle API error on form submission
- Location: C:\Users\shmes\Desktop\torch-group\e2e\contact.test.ts:79:7

# Error details

```
Error: locator.fill: Error: Element is not an <input>, <textarea> or [contenteditable] element
Call log:
  - waiting for getByLabel(/phone/i)
    - locator resolved to <select name="phoneCountry" class="PhoneInputCountrySelect" aria-label="Phone number country">…</select>
    - fill("+1234567890")
  - attempting fill action
    - waiting for element to be visible, enabled and editable

    at C:\Users\shmes\Desktop\torch-group\e2e\contact.test.ts:85:37
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
    - textbox "Name"
    - text: Email
    - textbox "Email": test@example.com
    - text: Phone Number
    - combobox "Phone number country":
      - option "International"
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
      - option "United States" [selected]
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
    - textbox "Enter phone number"
    - button [disabled]
    - paragraph: Phone number is required
    - text: Subject
    - textbox "Subject"
    - text: Message
    - textbox "Message"
    - text: Attachment (Optional)
    - img
    - text: Choose a file or drag and drop Image and pdfs
    - button "Choose File" [disabled]
    - checkbox "I agree to the Privacy Policy"
    - text: I agree to the
    - link "Privacy Policy":
      - /url: /privacy
    - button "Send Message"
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
  10 |     await page.getByLabel(/phone/i).fill('+1234567890');
  11 |     await page.getByLabel(/message/i).fill('This is a test message');
  12 |
  13 |     // Submit the form
  14 |     await page.getByRole('button', { name: /send/i }).click();
  15 |
  16 |     // Check for success message
  17 |     await expect(page.getByText(/message sent/i)).toBeVisible();
  18 |   });
  19 |
  20 |   test('should show validation errors', async ({ page }) => {
  21 |     await page.goto('/contact');
  22 |
  23 |     // Submit empty form
  24 |     await page.getByRole('button', { name: /send/i }).click();
  25 |
  26 |     // Check for validation errors
  27 |     await expect(page.getByText(/name is required/i)).toBeVisible();
  28 |     await expect(page.getByText(/email is required/i)).toBeVisible();
  29 |     await expect(page.getByText(/message is required/i)).toBeVisible();
  30 |   });
  31 |
  32 |   test('should handle phone verification', async ({ page }) => {
  33 |     await page.goto('/contact');
  34 |
  35 |     // Fill form except phone
  36 |     await page.getByLabel(/name/i).fill('Test User');
  37 |     await page.getByLabel(/email/i).fill('test@example.com');
  38 |     await page.getByLabel(/message/i).fill('Test message');
  39 |
  40 |     // Enter invalid phone
  41 |     await page.getByLabel(/phone/i).fill('invalid');
  42 |     await page.getByRole('button', { name: /send/i }).click();
  43 |
  44 |     // Check for phone validation error
  45 |     await expect(page.getByText(/invalid phone number/i)).toBeVisible();
  46 |
  47 |     // Enter valid phone
  48 |     await page.getByLabel(/phone/i).fill('+1234567890');
  49 |     
  50 |     // Request verification code
  51 |     await page.getByRole('button', { name: /verify/i }).click();
  52 |     
  53 |     // Check for verification code input
  54 |     await expect(page.getByLabel(/verification code/i)).toBeVisible();
  55 |   });
  56 |
  57 |   test('should submit contact form with file upload', async ({ page }) => {
  58 |     await page.goto('/contact');
  59 |
  60 |     // Fill out the form
  61 |     await page.getByLabel(/name/i).fill('Test User');
  62 |     await page.getByLabel(/email/i).fill('test@example.com');
  63 |     await page.getByLabel(/phone/i).fill('+1234567890');
  64 |     await page.getByLabel(/message/i).fill('This is a test message with file');
  65 |
  66 |     // Upload a file (assume input[type="file"] is present and visible)
  67 |     const fileChooserPromise = page.waitForEvent('filechooser');
  68 |     await page.getByLabel(/attachment/i).click();
  69 |     const fileChooser = await fileChooserPromise;
  70 |     await fileChooser.setFiles('e2e/helpers/test-upload.pdf');
  71 |
  72 |     // Submit the form
  73 |     await page.getByRole('button', { name: /send/i }).click();
  74 |
  75 |     // Check for success message
  76 |     await expect(page.getByText(/message sent/i)).toBeVisible();
  77 |   });
  78 |
  79 |   test('should handle API error on form submission', async ({ page }) => {
  80 |     await page.goto('/contact');
  81 |
  82 |     // Fill out the form
  83 |     await page.getByLabel(/name/i).fill('Test User');
  84 |     await page.getByLabel(/email/i).fill('test@example.com');
> 85 |     await page.getByLabel(/phone/i).fill('+1234567890');
     |                                     ^ Error: locator.fill: Error: Element is not an <input>, <textarea> or [contenteditable] element
  86 |     await page.getByLabel(/message/i).fill('This is a test message');
  87 |
  88 |     // Mock API error
  89 |     await page.route('/api/contact', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
  90 |
  91 |     // Submit the form
  92 |     await page.getByRole('button', { name: /send/i }).click();
  93 |
  94 |     // Check for error message
  95 |     await expect(page.getByText(/error/i)).toBeVisible();
  96 |   });
  97 | }); 
```