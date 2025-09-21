#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/uploads');
const OUTPUT_DIR = path.join(__dirname, '../public/uploads/optimized');

const SIZES = [
  { suffix: '_sm', width: 400, quality: 80 },
  { suffix: '_md', width: 800, quality: 85 },
  { suffix: '_lg', width: 1200, quality: 90 },
  { suffix: '_xl', width: 1600, quality: 95 }
];

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath);
  
  console.log(`🖼️  Processing: ${filename}${ext}`);

  // Create WebP versions
  for (const size of SIZES) {
    const outputPath = path.join(outputDir, `${filename}${size.suffix}.webp`);
    
    await sharp(inputPath)
      .resize(size.width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: size.quality })
      .toFile(outputPath);
      
    console.log(`  ✅ ${size.suffix} WebP: ${size.width}px @ ${size.quality}%`);
  }

  // Create optimized JPEG/PNG versions
  for (const size of SIZES) {
    const outputPath = path.join(outputDir, `${filename}${size.suffix}${ext}`);
    
    const pipeline = sharp(inputPath)
      .resize(size.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });

    if (ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.jpeg') {
      pipeline.jpeg({ quality: size.quality, progressive: true });
    } else if (ext.toLowerCase() === '.png') {
      pipeline.png({ quality: size.quality, progressive: true });
    }

    await pipeline.toFile(outputPath);
    console.log(`  ✅ ${size.suffix} ${ext.toUpperCase()}: ${size.width}px @ ${size.quality}%`);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  try {
    await ensureDir(OUTPUT_DIR);

    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && 
      !file.includes('_sm') && 
      !file.includes('_md') && 
      !file.includes('_lg') && 
      !file.includes('_xl')
    );

    if (imageFiles.length === 0) {
      console.log('ℹ️  No images found to optimize');
      return;
    }

    for (const file of imageFiles) {
      const inputPath = path.join(IMAGES_DIR, file);
      await optimizeImage(inputPath, OUTPUT_DIR);
      console.log('');
    }

    console.log(`✨ Optimization complete! Processed ${imageFiles.length} images`);
    console.log(`📂 Optimized images saved to: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Error during image optimization:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { optimizeImage, SIZES };