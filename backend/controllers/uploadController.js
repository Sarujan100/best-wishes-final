
const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploading file:', file.originalname, 'Size:', file.size);

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'uploads',
      resource_type: 'auto',
    });

    console.log('Upload successful:', result.secure_url);

    res.json({ 
      success: true,
      data: { 
        url: result.secure_url,
        public_id: result.public_id 
      } 
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ 
      success: false,
      error: 'Upload failed', 
      details: err.message 
    });
  }
};
