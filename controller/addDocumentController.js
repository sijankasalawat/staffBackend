const Document = require('../model/documentModel');
const mongoose = require('mongoose');
const User = require("../model/userModel");
const cloudinary = require("cloudinary").v2;

const ObjectId = mongoose.Types.ObjectId;

const addDocument = async (req, res) => {
    try {
      const { name, description } = req.body;
      const { file } = req.files;
      const userId = req.params.userId;
  
      // Validate data
      if (!name || !description || !file) {
        return res.status(400).json({
          success: false,
          message: "Please enter all fields including the file",
        });
      }
  
      // Upload file to Cloudinary
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: 'documents',
        crop: "scale"
      });
  
      if (!uploadedFile || !uploadedFile.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload file to Cloudinary",
        });
      }
  
      // Create a new document
      const newDocument = new Document({
        name,
        description,
        file: uploadedFile.secure_url,
        userId
      });
  
      // Save the document to the database
      await newDocument.save();
  
      res.status(201).json({
        success: true,
        message: "Document added successfully",
        document: newDocument
      });
    } catch (error) {
      console.error('Error adding document:', error);
  
      // Handle specific error cases
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error. Please check your input.",
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.json({
                success: false,
                message: "Invalid document ID"
            });
        }
        const document = await Document.findById(id);
        if (!document) {
            return res.json({
                success: false,
                message: "Document not found"
            });
        }
        return res.json({
            success: true,
            document
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
module.exports = {addDocument,getDocumentById}