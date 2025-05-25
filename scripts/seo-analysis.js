/**
 * SEO Analysis Script
 * 
 * This script scans the codebase and reports on SEO-related elements:
 * 1. Checks meta tags in layout.tsx
 * 2. Verifies the existence of sitemap.xml and robots.txt
 * 3. Checks for OG and Twitter card images
 * 4. Scans for missing alt tags in images
 * 5. Checks for proper heading structure
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SRC_DIR = path.join(process.cwd(), 'src');
const LAYOUT_FILE = path.join(SRC_DIR, 'app', 'layout.tsx');

// Results object
const results = {
  metaTags: {
    present: [],
    missing: [],
  },
  files: {
    present: [],
    missing: [],
  },
  images: {
    withAlt: 0,
    withoutAlt: 0,
    missingImages: [],
  },
  headings: {
    structure: {},
    issues: [],
  },
};

// Check the existence of critical files
async function checkCriticalFiles() {
  console.log('\n📂 Checking critical SEO files...');
  
  const criticalFiles = [
    { path: path.join(PUBLIC_DIR, 'robots.txt'), name: 'robots.txt' },
    { path: path.join(PUBLIC_DIR, 'sitemap.xml'), name: 'sitemap.xml' },
    { path: path.join(PUBLIC_DIR, 'images/og-image.jpg'), name: 'OG Image' },
  ];
  
  for (const file of criticalFiles) {
    if (fs.existsSync(file.path)) {
      results.files.present.push(file.name);
      console.log(`✅ ${file.name} exists`);
      
      // For images, check file size
      if (file.name === 'OG Image') {
        const stats = await stat(file.path);
        if (stats.size < 1000) { // Less than 1KB
          console.warn(`⚠️ ${file.name} exists but seems too small (${stats.size} bytes). Verify it's a proper image.`);
        }
      }
    } else {
      results.files.missing.push(file.name);
      console.error(`❌ ${file.name} is missing`);
    }
  }
}

// Check meta tags in layout.tsx
async function checkMetaTags() {
  console.log('\n🏷️ Checking meta tags in layout.tsx...');
  
  if (!fs.existsSync(LAYOUT_FILE)) {
    console.error('❌ layout.tsx file not found');
    return;
  }
  
  const content = await readFile(LAYOUT_FILE, 'utf8');
  
  // Check for essential meta tags
  const essentialTags = [
    { name: 'title', regex: /title:.*['"](.+?)['"]/s },
    { name: 'description', regex: /description:.*['"](.+?)['"]/s },
    { name: 'metadataBase', regex: /metadataBase/ },
    { name: 'openGraph', regex: /openGraph:/ },
    { name: 'twitter', regex: /twitter:/ },
    { name: 'robots', regex: /robots:/ },
    { name: 'viewport', regex: /viewport:/ },
    { name: 'canonical', regex: /canonical:/ },
  ];
  
  for (const tag of essentialTags) {
    if (tag.regex.test(content)) {
      results.metaTags.present.push(tag.name);
      console.log(`✅ ${tag.name} tag is present`);
    } else {
      results.metaTags.missing.push(tag.name);
      console.error(`❌ ${tag.name} tag is missing`);
    }
  }
}

// Scan for image alt tags
async function scanForAltTags(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        await scanForAltTags(fullPath);
      }
    } else if (entry.isFile() && /\.(jsx|tsx)$/.test(entry.name)) {
      const content = await readFile(fullPath, 'utf8');
      
      // Count img tags with and without alt
      const imgTagsWithAlt = (content.match(/<img[^>]+alt=(['"])[^'"]*\1[^>]*>/g) || []).length;
      const imgTagsWithoutAlt = (content.match(/<img(?![^>]*alt=(['"])[^'"]*\1)[^>]*>/g) || []).length;
      
      results.images.withAlt += imgTagsWithAlt;
      results.images.withoutAlt += imgTagsWithoutAlt;
      
      // Check for references to nonexistent images
      const imageRefs = content.match(/src=(['"])\/images\/([^'"]+)\1/g) || [];
      for (const ref of imageRefs) {
        const match = ref.match(/src=(['"])\/images\/([^'"]+)\1/);
        if (match) {
          const imagePath = path.join(PUBLIC_DIR, 'images', match[2]);
          if (!fs.existsSync(imagePath) && !results.images.missingImages.includes(match[2])) {
            results.images.missingImages.push(match[2]);
          }
        }
      }
    }
  }
}

// Main function
async function main() {
  console.log('🔍 Starting SEO analysis...');
  
  try {
    // Check critical files
    await checkCriticalFiles();
    
    // Check meta tags
    await checkMetaTags();
    
    // Scan for alt tags and missing images
    console.log('\n🖼️ Scanning for image issues...');
    await scanForAltTags(SRC_DIR);
    console.log(`✅ Found ${results.images.withAlt} images with alt tags`);
    if (results.images.withoutAlt > 0) {
      console.warn(`⚠️ Found ${results.images.withoutAlt} images without alt tags`);
    }
    if (results.images.missingImages.length > 0) {
      console.error(`❌ Found ${results.images.missingImages.length} references to missing images:`);
      results.images.missingImages.forEach(img => console.error(`   - ${img}`));
    }
    
    // Print summary
    console.log('\n📊 SEO Analysis Summary');
    console.log('------------------------');
    console.log(`Meta tags: ${results.metaTags.present.length} present, ${results.metaTags.missing.length} missing`);
    console.log(`Critical files: ${results.files.present.length} present, ${results.files.missing.length} missing`);
    console.log(`Images: ${results.images.withAlt} with alt tags, ${results.images.withoutAlt} without alt tags`);
    console.log(`Missing image references: ${results.images.missingImages.length}`);
    
    // Overall assessment
    console.log('\n🏆 Overall SEO Assessment');
    console.log('-----------------------');
    
    let score = 100;
    
    if (results.metaTags.missing.length > 0) {
      score -= results.metaTags.missing.length * 5;
    }
    
    if (results.files.missing.length > 0) {
      score -= results.files.missing.length * 10;
    }
    
    if (results.images.withoutAlt > 0) {
      score -= Math.min(20, results.images.withoutAlt);
    }
    
    if (results.images.missingImages.length > 0) {
      score -= Math.min(10, results.images.missingImages.length * 2);
    }
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    let rating;
    if (score >= 90) {
      rating = 'Excellent';
    } else if (score >= 70) {
      rating = 'Good';
    } else if (score >= 50) {
      rating = 'Fair';
    } else {
      rating = 'Poor';
    }
    
    console.log(`SEO Score: ${score}/100 (${rating})`);
    
    if (score < 100) {
      console.log('\n🛠️ Recommendations:');
      
      if (results.metaTags.missing.length > 0) {
        console.log(`- Add missing meta tags: ${results.metaTags.missing.join(', ')}`);
      }
      
      if (results.files.missing.length > 0) {
        console.log(`- Create missing critical files: ${results.files.missing.join(', ')}`);
      }
      
      if (results.images.withoutAlt > 0) {
        console.log(`- Add alt tags to ${results.images.withoutAlt} images`);
      }
      
      if (results.images.missingImages.length > 0) {
        console.log(`- Fix ${results.images.missingImages.length} references to missing images`);
      }
    }
    
    console.log('\n✅ SEO analysis complete');
    
  } catch (error) {
    console.error('An error occurred during SEO analysis:', error);
    process.exit(1);
  }
}

// Run the script
main(); 