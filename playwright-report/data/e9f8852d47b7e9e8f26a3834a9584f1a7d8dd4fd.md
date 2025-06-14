# Test info

- Name: Performance Tests >> should optimize form submission
- Location: C:\Users\shmes\Desktop\torch-group\e2e\performance.spec.ts:117:7

# Error details

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Message sent') to be visible

    at C:\Users\shmes\Desktop\torch-group\e2e\performance.spec.ts:130:45
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
    - textbox "Name"
    - paragraph: Name is required
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
    - paragraph: Subject is required
    - text: Message
    - textbox "Message": Test message
    - text: Attachment (Optional)
    - img
    - text: Choose a file or drag and drop Image and pdfs
    - button "Choose File" [disabled]
    - checkbox "I agree to the Privacy Policy"
    - text: I agree to the
    - link "Privacy Policy":
      - /url: /privacy
    - paragraph: You must agree to the Privacy Policy
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
   30 |       await page.fill('textarea[name="content"]', `Content for post ${i}`);
   31 |       await page.click('button:has-text("Publish")');
   32 |     }
   33 |
   34 |     // Measure blog list load time
   35 |     const startTime = Date.now();
   36 |     await page.goto('/blog');
   37 |     const loadTime = Date.now() - startTime;
   38 |
   39 |     expect(loadTime).toBeLessThan(2000); // 2s load time with multiple posts
   40 |   });
   41 |
   42 |   test('should handle slow network conditions', async ({ page }) => {
   43 |     // Simulate 3G network
   44 |     await mockNetworkConditions(page, { latency: 100 });
   45 |
   46 |     // Load homepage
   47 |     await page.goto('/');
   48 |
   49 |     // Check if loading indicators appear
   50 |     await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();
   51 |
   52 |     // Verify content loads eventually
   53 |     await expect(page.locator('h1')).toBeVisible();
   54 |     await expect(page.locator('[data-testid="loading-skeleton"]')).not.toBeVisible();
   55 |   });
   56 |
   57 |   test('should optimize image loading', async ({ page }) => {
   58 |     await page.goto('/');
   59 |
   60 |     // Check if images use lazy loading
   61 |     const images = await page.locator('img').all();
   62 |     for (const image of images) {
   63 |       const loading = await image.getAttribute('loading');
   64 |       const isAboveTheFold = await image.isVisible();
   65 |       
   66 |       if (isAboveTheFold) {
   67 |         // Critical images should load eagerly
   68 |         expect(loading).not.toBe('lazy');
   69 |       } else {
   70 |         // Non-critical images should be lazy loaded
   71 |         expect(loading).toBe('lazy');
   72 |       }
   73 |     }
   74 |   });
   75 |
   76 |   test('should handle offline mode', async ({ page }) => {
   77 |     // Load page first
   78 |     await page.goto('/');
   79 |     
   80 |     // Enable offline mode
   81 |     await mockNetworkConditions(page, { offline: true });
   82 |     
   83 |     // Navigate to another page
   84 |     await page.click('text=About');
   85 |     
   86 |     // Should show offline message
   87 |     await expect(page.locator('text=You are offline')).toBeVisible();
   88 |     
   89 |     // Should show cached content
   90 |     await expect(page.locator('main')).not.toBeEmpty();
   91 |   });
   92 |
   93 |   test('should maintain responsive performance', async ({ page }) => {
   94 |     // Test different viewport sizes
   95 |     const viewports = [
   96 |       { width: 375, height: 667 },  // Mobile
   97 |       { width: 768, height: 1024 }, // Tablet
   98 |       { width: 1440, height: 900 }  // Desktop
   99 |     ];
  100 |
  101 |     for (const viewport of viewports) {
  102 |       await page.setViewportSize(viewport);
  103 |       
  104 |       const startTime = Date.now();
  105 |       await page.goto('/');
  106 |       const loadTime = Date.now() - startTime;
  107 |
  108 |       // Performance should be consistent across viewports
  109 |       expect(loadTime).toBeLessThan(3000);
  110 |       
  111 |       // Check for layout shifts
  112 |       const metrics = await checkPerformance(page);
  113 |       expect(metrics.cls).toBeLessThan(0.1);
  114 |     }
  115 |   });
  116 |
  117 |   test('should optimize form submission', async ({ page }) => {
  118 |     await page.goto('/contact');
  119 |
  120 |     // Fill form
  121 |     await page.fill('input[name="name"]', 'Test User');
  122 |     await page.fill('input[name="email"]', 'test@example.com');
  123 |     await page.fill('textarea[name="message"]', 'Test message');
  124 |
  125 |     // Measure submission time
  126 |     const startTime = Date.now();
  127 |     await page.click('button[type="submit"]');
  128 |     
  129 |     // Wait for success message
> 130 |     await page.locator('text=Message sent').waitFor();
      |                                             ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  131 |     const submitTime = Date.now() - startTime;
  132 |
  133 |     expect(submitTime).toBeLessThan(1000); // 1s submission time
  134 |   });
  135 | }); 
```