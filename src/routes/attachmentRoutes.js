import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as attachmentController from '../controllers/attachmentController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - allow images and common file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|txt|doc|docx|xls|xlsx|zip/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Ongeldig bestandstype. Alleen afbeeldingen en documenten zijn toegestaan.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// GET /api/attachments/bookmark/:bookmark_id - Get all attachments for a bookmark
router.get('/bookmark/:bookmark_id', attachmentController.getBookmarkAttachments);

// POST /api/attachments/bookmark/:bookmark_id - Upload attachment for a bookmark
router.post('/bookmark/:bookmark_id', upload.single('file'), attachmentController.uploadAttachment);

// GET /api/attachments/:id/file - Get attachment file
router.get('/:id/file', attachmentController.getAttachmentFile);

// DELETE /api/attachments/:id - Delete attachment
router.delete('/:id', attachmentController.deleteAttachment);

export default router;