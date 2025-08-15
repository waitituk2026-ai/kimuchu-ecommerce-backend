// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: CLOUDINARY_API_SECRET || 'your_api_secret',
  secure: true
});

module.exports = cloudinary;
