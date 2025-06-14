# Test info

- Name: Visual Regression Tests >> homepage should match snapshot
- Location: C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:9:7

# Error details

```
Error: Timed out 5000ms waiting for expect(page).toHaveScreenshot(expected)

  Failed to take two consecutive stable screenshots.
Previous: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-5874f-epage-should-match-snapshot-chromium\homepage-previous.png
Received: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-5874f-epage-should-match-snapshot-chromium\homepage-actual.png
    Diff: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-5874f-epage-should-match-snapshot-chromium\homepage-diff.png

Call log:
  - expect.toHaveScreenshot(homepage.png) with timeout 5000ms
    - generating new stable screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 7848px, received 1280px by 720px. 908363 pixels (ratio 0.10 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 4092 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 720px, received 1280px by 7892px. 9193315 pixels (ratio 0.92 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - Timeout 5000ms exceeded.

    at C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:11:24
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
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
  - img "Torch Logo"
  - heading "Welcome to Torch" [level=1]:
    - text: Welcome to Torch
    - img
  - paragraph: Empowering businesses through Media| solutions and strategic partnerships.
  - button "Explore Torch"
  - text: WHAT WE DO
  - heading "Our Services" [level=2]
  - paragraph: Comprehensive digital solutions to ignite your brand and accelerate growth.
  - paragraph: We offer everything you need to succeed in the digital landscape.
  - heading "Media Press" [level=3]
  - paragraph: Our digital marketing services will help your business grow online and attract more customers.
  - heading "Talent Support" [level=3]
  - paragraph: Strategic marketing campaigns to grow your brand presence and reach your target audience.
  - heading "Marketing Systems" [level=3]
  - paragraph: Connect with the best professionals in the industry to scale your team effectively.
  - text: ABOUT US
  - heading "About Torch Group" [level=2]
  - paragraph: Igniting creativity and empowering talent to shape the future of digital content.
  - paragraph: We're more than just a creative agency – we're a catalyst for innovation, a platform for exceptional talent, and a driving force in the evolving media landscape.
  - text: OUR BRANDS
  - heading "Torch Group Brands" [level=3]
  - paragraph: Explore our family of brands, each dedicated to excellence in their specialized fields.
  - heading "Torch Shop" [level=3]
  - paragraph: E-commerce solutions and digital marketplace
  - link "Visit Website":
    - /url: https://shop.torchgroup.co
    - button "Visit Website"
  - heading "Torch Star" [level=3]
  - paragraph: Media and entertainment platform
  - link "Visit Website":
    - /url: https://star.torchgroup.co
    - button "Visit Website"
  - heading "Torch Loop" [level=3]
  - paragraph: Community and networking hub
  - link "Visit Website":
    - /url: https://loop.torchgroup.co
    - button "Visit Website"
  - heading "Torch Auto" [level=3]
  - paragraph: Automotive technology solutions
  - text: Coming Soon STAY INFORMED
  - heading "Our Blog" [level=2]
  - paragraph: Discover the latest insights, trends, and strategies in digital marketing, technology, and business growth.
  - paragraph: We share what matters most for your brand's growth.
  - heading "No Blog Posts Yet" [level=3]
  - paragraph: Check back soon for articles and insights.
  - link "View All Articles":
    - /url: /blog
  - text: FEATURED TALENT
  - heading "Torch Talents" [level=2]
  - paragraph: Projects and talents in various creative fields, raising the quality of creative life & audience awareness & engagement.
  - paragraph: Discover the next generation of creative leaders and visionaries.
  - paragraph: SOON
  - paragraph: SOON
  - paragraph: SOON
  - text: CONTACT US
  - heading "Get in Touch" [level=2]
  - paragraph: Let's discuss your next project.
  - paragraph: Fill out the form and our team will get back to you as soon as possible.
  - text: Name
  - textbox "Name"
  - text: Email
  - textbox "Email"
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
  - heading "TOP PARTNERS" [level=2]
  - img "Torch Logo Watermark"
  - img
  - img "Torch Logo"
  - img "Torch Logo Watermark"
  - img
  - img "Torch Logo"
  - img "Torch Logo Watermark"
  - img
  - img "Torch Logo"
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
   3 | test.describe('Visual Regression Tests', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Set a consistent viewport size for screenshots
   6 |     await page.setViewportSize({ width: 1280, height: 720 });
   7 |   });
   8 |
   9 |   test('homepage should match snapshot', async ({ page }) => {
  10 |     await page.goto('/');
> 11 |     await expect(page).toHaveScreenshot('homepage.png', {
     |                        ^ Error: Timed out 5000ms waiting for expect(page).toHaveScreenshot(expected)
  12 |       fullPage: true,
  13 |       threshold: 0.2, // Allow 0.2% pixel difference
  14 |     });
  15 |   });
  16 |
  17 |   test('about page should match snapshot', async ({ page }) => {
  18 |     await page.goto('/about');
  19 |     await expect(page).toHaveScreenshot('about.png', {
  20 |       fullPage: true,
  21 |       threshold: 0.2,
  22 |     });
  23 |   });
  24 |
  25 |   test('services page should match snapshot', async ({ page }) => {
  26 |     await page.goto('/services');
  27 |     await expect(page).toHaveScreenshot('services.png', {
  28 |       fullPage: true,
  29 |       threshold: 0.2,
  30 |     });
  31 |   });
  32 |
  33 |   test('blog page should match snapshot', async ({ page }) => {
  34 |     await page.goto('/blog');
  35 |     await expect(page).toHaveScreenshot('blog.png', {
  36 |       fullPage: true,
  37 |       threshold: 0.2,
  38 |     });
  39 |   });
  40 |
  41 |   test('contact page should match snapshot', async ({ page }) => {
  42 |     await page.goto('/contact');
  43 |     await expect(page).toHaveScreenshot('contact.png', {
  44 |       fullPage: true,
  45 |       threshold: 0.2,
  46 |     });
  47 |   });
  48 |
  49 |   test('mobile homepage should match snapshot', async ({ page }) => {
  50 |     await page.setViewportSize({ width: 375, height: 667 });
  51 |     await page.goto('/');
  52 |     await expect(page).toHaveScreenshot('homepage-mobile.png', {
  53 |       fullPage: true,
  54 |       threshold: 0.2,
  55 |     });
  56 |   });
  57 |
  58 |   test('dashboard should match snapshot', async ({ page }) => {
  59 |     // Login first
  60 |     await page.goto('/admin-login');
  61 |     await page.getByLabel(/email/i).fill('admin@torchgroup.co');
  62 |     await page.getByLabel(/password/i).fill('admin123');
  63 |     await page.getByRole('button', { name: /sign in/i }).click();
  64 |
  65 |     // Take dashboard screenshot
  66 |     await expect(page).toHaveScreenshot('dashboard.png', {
  67 |       fullPage: true,
  68 |       threshold: 0.2,
  69 |     });
  70 |   });
  71 | }); 
```