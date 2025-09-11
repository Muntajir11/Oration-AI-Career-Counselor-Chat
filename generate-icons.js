const sharp = require('sharp');
const fs = require('fs');

const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="64" fill="#2563eb"/>
  
  <!-- Briefcase -->
  <rect x="96" y="224" width="320" height="192" rx="32" fill="white"/>
  <rect x="96" y="224" width="320" height="48" fill="#dbeafe"/>
  <rect x="208" y="192" width="96" height="32" rx="16" fill="white"/>
  
  <!-- Person head -->
  <circle cx="256" cy="128" r="48" fill="white"/>
  <path d="M160 320c0-70.4 57.6-128 96-128s96 57.6 96 128" stroke="white" stroke-width="24" fill="none"/>
</svg>`;

async function generateIcons() {
  try {
    // Generate different sizes
    const sizes = [16, 32, 192, 512, 180]; // 180 for Apple touch icon
    
    for (const size of sizes) {
      const outputFile = size === 180 ? 
        `public/apple-icon.png` : 
        `public/icon-${size}.png`;
        
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputFile);
        
      console.log(`Generated ${outputFile}`);
    }
    
    // Generate favicon.ico (16x16)
    await sharp(Buffer.from(svgContent))
      .resize(16, 16)
      .png()
      .toFile('src/app/favicon.png');
      
    console.log('Generated src/app/favicon.png');
    console.log('Icon generation complete!');
    
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
