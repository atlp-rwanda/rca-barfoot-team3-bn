const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.delete = (path) => new Promise((resolve) => {
  cloudinary.uploader.destroy(path.split('.').reverse()[1].split('/').reverse()[0], (result) => {
    resolve({
      result
    });
  });
});

exports.uploads = (file, folder) => new Promise((resolve) => {
  cloudinary.uploader.upload(file, (result) => {
    resolve({
      url: result.url,
      id: result.public_id
    });
  }, {
    resource_type: 'auto',
    folder
  });
});
