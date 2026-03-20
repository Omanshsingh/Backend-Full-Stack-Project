const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let client = null;
let imagekitEnabled = false;

try {
  const ImageKit = require('@imagekit/nodejs');

  if (
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    // New @imagekit/nodejs SDK only needs privateKey in constructor
    client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY.trim(),
    });
    imagekitEnabled = true;
    console.log('ImageKit initialized successfully ✓');
  } else {
    console.warn('ImageKit not configured — saving uploads locally.');
  }
} catch (error) {
  console.warn('ImageKit failed to initialize:', error.message);
}

async function uploadFile(buffer, originalName = 'image.jpg') {
  if (imagekitEnabled) {
    try {
      const { toFile } = require('@imagekit/nodejs');

      // New SDK: client.files.upload() with toFile() helper for buffers
      const result = await client.files.upload({
        file: await toFile(buffer, originalName),
        fileName: originalName,
      });

      console.log('ImageKit upload success:', result.url);
      return { url: result.url };
    } catch (imagekitError) {
      console.error('ImageKit upload failed:', imagekitError.message);
      console.error('Falling back to local storage...');
    }
  }

  // Fallback: save locally
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(originalName) || '.jpg';
  const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const filePath = path.join(uploadsDir, safeName);

  await fs.promises.writeFile(filePath, buffer);

  return { url: `http://localhost:3000/uploads/${safeName}` };
}

module.exports = uploadFile;