// Create OG image by copying and renaming an existing image
const fs = require('fs');
const path = require('path');

async function createOGImage() {
  const sourcePath = path.join(__dirname, '..', 'public', 'images', 'torch_group_logo.png');
  const destinationPath = path.join(__dirname, '..', 'public', 'images', 'og-image.jpg');
  
  console.log('Creating OG image...');
  console.log(`Source: ${sourcePath}`);
  console.log(`Destination: ${destinationPath}`);
  
  try {
    // Check if the source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error('❌ Source file not found!');
      return;
    }
    
    // Copy the source file to the destination
    fs.copyFileSync(sourcePath, destinationPath);
    
    console.log('✅ OG image created successfully!');
    
    // Create a README file with instructions for improving the OG image
    const readmePath = path.join(__dirname, '..', 'public', 'images', 'OG_IMAGE_README.md');
    const readmeContent = `# OG Image

The current OG image is a temporary placeholder created by copying the Torch Group logo.

## Recommendation

For better social sharing results, replace this with a custom designed OG image that:

- Has dimensions of 1200×630 pixels (standard for most social platforms)
- Includes the Torch Group logo, but smaller and with more context
- Uses a dark background with red accent coloring consistent with the brand
- Includes a short tagline or brand positioning statement
- Optimizes file size (aim for under 200KB)

This image will be used when your website is shared on social media platforms like Facebook, Twitter, and LinkedIn.
`;
    
    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ OG image README created with recommendations.');
    
  } catch (error) {
    console.error('❌ Error creating OG image:', error);
  }
}

createOGImage(); 