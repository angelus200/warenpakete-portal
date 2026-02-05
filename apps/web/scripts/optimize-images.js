const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/categories');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg'));

async function optimizeImages() {
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace('.jpeg', '.webp'));

    await sharp(input)
      .resize(600, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(output);

    const inputStats = fs.statSync(input);
    const outputStats = fs.statSync(output);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${file} → ${file.replace('.jpeg', '.webp')} (${savings}% kleiner)`);
  }

  console.log('\n✅ Alle Bilder optimiert!');
}

optimizeImages().catch(console.error);
