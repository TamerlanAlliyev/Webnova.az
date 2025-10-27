/**
 * IMAGE OPTIMIZATION SCRIPT
 * Webnova - Performance Optimization
 * 
 * Bu script Sharp kütüxanəsindən istifadə edərək şəkilləri avtomatik optimallaşdırır.
 * 
 * QURAŞDIRMA:
 * npm install sharp
 * 
 * İSTİFADƏ:
 * node optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  input: './assets/images/settings/CTAbg.webp',
  outputDesktop: './assets/images/settings/CTAbg-optimized.webp',
  outputMobile: './assets/images/settings/CTAbg-mobile.webp',
  
  desktop: {
    width: 1920,
    height: 1080,
    quality: 75
  },
  
  mobile: {
    width: 800,
    height: 600,
    quality: 70
  }
};

// Check if Sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.error('❌ Sharp quraşdırılmayıb!');
  console.log('📦 Quraşdırma: npm install sharp');
  process.exit(1);
}

// Optimize images
async function optimizeImages() {
  console.log('🚀 Şəkil Optimallaşdırması Başladı...\n');

  try {
    // Check if input file exists
    if (!fs.existsSync(CONFIG.input)) {
      console.error(`❌ Fayl tapılmadı: ${CONFIG.input}`);
      console.log('📁 Zəhmət olmasa faylın yolunu yoxlayın.');
      process.exit(1);
    }

    // Get original file size
    const originalStats = fs.statSync(CONFIG.input);
    const originalSizeKB = (originalStats.size / 1024).toFixed(2);
    console.log(`📄 Original: ${CONFIG.input}`);
    console.log(`📊 Original ölçü: ${originalSizeKB} KB\n`);

    // Optimize for Desktop
    console.log('🖥️  Desktop versiyası optimallaşdırılır...');
    await sharp(CONFIG.input)
      .resize(CONFIG.desktop.width, CONFIG.desktop.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: CONFIG.desktop.quality })
      .toFile(CONFIG.outputDesktop);

    const desktopStats = fs.statSync(CONFIG.outputDesktop);
    const desktopSizeKB = (desktopStats.size / 1024).toFixed(2);
    const desktopSaving = ((1 - desktopStats.size / originalStats.size) * 100).toFixed(1);
    
    console.log(`✅ Desktop: ${CONFIG.outputDesktop}`);
    console.log(`   Ölçü: ${desktopSizeKB} KB (${desktopSaving}% qənaət)\n`);

    // Optimize for Mobile
    console.log('📱 Mobil versiyası optimallaşdırılır...');
    await sharp(CONFIG.input)
      .resize(CONFIG.mobile.width, CONFIG.mobile.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: CONFIG.mobile.quality })
      .toFile(CONFIG.outputMobile);

    const mobileStats = fs.statSync(CONFIG.outputMobile);
    const mobileSizeKB = (mobileStats.size / 1024).toFixed(2);
    const mobileSaving = ((1 - mobileStats.size / originalStats.size) * 100).toFixed(1);
    
    console.log(`✅ Mobil: ${CONFIG.outputMobile}`);
    console.log(`   Ölçü: ${mobileSizeKB} KB (${mobileSaving}% qənaət)\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 ÖZƏT');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Original:  ${originalSizeKB} KB`);
    console.log(`Desktop:   ${desktopSizeKB} KB (${CONFIG.desktop.width}x${CONFIG.desktop.height})`);
    console.log(`Mobil:     ${mobileSizeKB} KB (${CONFIG.mobile.width}x${CONFIG.mobile.height})`);
    console.log(`\n💰 Ümumi qənaət: ${(originalStats.size - desktopStats.size) / 1024} KB\n`);
    
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ NÖVBƏ Tİ ADDIMLAR:');
    console.log('═══════════════════════════════════════════════════');
    console.log('1. index.html-i yenilə (sətr ~1385):');
    console.log('   url(\'./assets/images/settings/CTAbg-optimized.webp\')');
    console.log('');
    console.log('2. Deploy et:');
    console.log('   git add .');
    console.log('   git commit -m "Image optimization"');
    console.log('   git push origin main');
    console.log('');
    console.log('3. Test et:');
    console.log('   https://pagespeed.web.dev/');
    console.log('   Gözləmə: Performance 95+, LCP <2.0s');
    console.log('');
    
  } catch (error) {
    console.error('❌ XƏTA:', error.message);
    process.exit(1);
  }
}

// Additional images (Projects)
async function optimizeProjectImages() {
  console.log('\n📦 Layihə şəkillərini optimallaşdır...\n');

  const projectImages = [
    {
      input: './assets/images/projects/image.png',
      output: './assets/images/projects/buta-erp.webp',
      width: 1200,
      height: 800,
      quality: 80
    }
  ];

  for (const img of projectImages) {
    if (fs.existsSync(img.input)) {
      try {
        await sharp(img.input)
          .resize(img.width, img.height, { fit: 'cover' })
          .webp({ quality: img.quality })
          .toFile(img.output);
        
        const stats = fs.statSync(img.output);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ ${path.basename(img.output)}: ${sizeKB} KB`);
      } catch (error) {
        console.error(`❌ ${img.input}: ${error.message}`);
      }
    }
  }
}

// Run
(async () => {
  await optimizeImages();
  
  console.log('\n📦 Əlavə optimallaşdırma:');
  console.log('image.png → buta-erp.webp istəyirsiniz? (y/n)');
  console.log('Əl ilə işlətmək üçün: optimizeProjectImages() funksiyasını aktiv edin.\n');
  
  // Uncomment to optimize project images too:
  // await optimizeProjectImages();
})();

