import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, teacherOnly } from '../middleware/auth.js';
import { isS3Enabled, uploadToS3, deleteFromS3 } from '../services/storage.js';

const router = express.Router();

// Create uploads directory if it doesn't exist (for local storage)
const uploadsDir = path.join(process.cwd(), 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const documentsDir = path.join(uploadsDir, 'documents');
const imagesDir = path.join(uploadsDir, 'images');

[uploadsDir, videosDir, documentsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function generateFilename(originalname) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const safeName = originalname.replace(/[^a-zA-Z0-9.]/g, '_').slice(0, 50);
  return `${uniqueSuffix}-${safeName}`;
}

// Local disk storage (used when S3 is not configured)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    if (file.mimetype.startsWith('video/')) uploadPath = videosDir;
    else if (file.mimetype.startsWith('image/')) uploadPath = imagesDir;
    else if (
      file.mimetype === 'application/pdf' ||
      file.mimetype.includes('document') ||
      file.mimetype.includes('word') ||
      file.mimetype.includes('presentation') ||
      file.mimetype.includes('spreadsheet') ||
      file.mimetype === 'text/plain'
    ) uploadPath = documentsDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, generateFilename(file.originalname));
  }
});

// File filter - allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`File type ${file.mimetype} is not allowed`), false);
};

// Multer: use memory storage when S3 is enabled, disk otherwise
const storage = isS3Enabled() ? multer.memoryStorage() : diskStorage;
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

function getFileType(mimetype) {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  return 'document';
}

/**
 * @route   POST /api/upload/file
 * @desc    Upload a single file (video, document, image). Uses S3+CloudFront when AWS env vars are set.
 * @access  Private (Teacher only)
 */
router.post('/file', protect, teacherOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let fileUrl;
    const filename = isS3Enabled()
      ? generateFilename(req.file.originalname)
      : req.file.filename;

    if (isS3Enabled()) {
      const { url } = await uploadToS3(req.file.buffer, req.file.mimetype, filename);
      fileUrl = url;
    } else {
      fileUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;
    }

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        fileType: getFileType(req.file.mimetype),
        url: fileUrl,
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files. Uses S3+CloudFront when AWS env vars are set.
 * @access  Private (Teacher only)
 */
router.post('/multiple', protect, teacherOnly, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const filename = isS3Enabled()
        ? generateFilename(file.originalname)
        : file.filename;
      let fileUrl;
      if (isS3Enabled()) {
        const { url } = await uploadToS3(file.buffer, file.mimetype, filename);
        fileUrl = url;
      } else {
        fileUrl = `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`;
      }
      uploadedFiles.push({
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        fileType: getFileType(file.mimetype),
        url: fileUrl,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/upload/file/:filename
 * @desc    Delete an uploaded file (local or S3).
 * @access  Private (Teacher only)
 */
router.delete('/file/:filename', protect, teacherOnly, async (req, res) => {
  try {
    const { filename } = req.params;

    if (isS3Enabled()) {
      const deleted = await deleteFromS3(filename);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
    } else {
      const directories = [videosDir, documentsDir, imagesDir];
      let fileFound = false;
      for (const dir of directories) {
        const filePath = path.join(dir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          fileFound = true;
          break;
        }
      }
      if (!fileFound) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
    }

    return res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message,
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 100MB' });
    }
    return res.status(400).json({ message: error.message });
  }
  if (error) return res.status(400).json({ message: error.message });
  next();
});

export default router;
