import db from '../database/db.js';

// Get all attachments for a bookmark
export const getBookmarkAttachments = (req, res) => {
  try {
    const { bookmark_id } = req.params;
    
    const attachments = db.prepare(`
      SELECT * FROM attachments
      WHERE bookmark_id = ?
      ORDER BY created_at DESC
    `).all(bookmark_id);
    
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload attachment (handled by middleware)
export const uploadAttachment = (req, res) => {
  try {
    const { bookmark_id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Check if bookmark exists
    const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(bookmark_id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    // Save attachment to database
    const insert = db.prepare(`
      INSERT INTO attachments (bookmark_id, filename, original_name, file_type, file_size, file_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(
      bookmark_id,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      req.file.path
    );
    
    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete attachment
export const deleteAttachment = (req, res) => {
  try {
    const { id } = req.params;
    
    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(id);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    
    // Delete from database
    db.prepare('DELETE FROM attachments WHERE id = ?').run(id);
    
    // Delete file from filesystem
    const fs = await import('fs');
    try {
      fs.unlinkSync(attachment.file_path);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attachment file
export const getAttachmentFile = (req, res) => {
  try {
    const { id } = req.params;
    
    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(id);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(attachment.file_path)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.sendFile(attachment.file_path);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};