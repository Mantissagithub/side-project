const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const File = require('./models/file'); // Adjust the path as per your project

const app = express();
app.use(cors())

// MongoDB connection
mongoose.connect('mongodb://mantissa6789:Mantis164758@ac-qn0oqwt-shard-00-00.9ramotn.mongodb.net:27017,ac-qn0oqwt-shard-00-01.9ramotn.mongodb.net:27017,ac-qn0oqwt-shard-00-02.9ramotn.mongodb.net:27017/?replicaSet=atlas-w4ijlq-shard-0&ssl=true&authSource=admin', {
  dbName: "ebramha-project"
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Ensure 'uploads' directory exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../assets'); // Adjust path to assets folder
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = new Date().toLocaleString().replace(/[/:]/g, '-');
      cb(null, `${req.folderName}-uploaded-${timestamp}${path.extname(file.originalname)}`);
    },
  });

const upload = multer({ storage });

// Function to recursively save files and directories to MongoDB
const saveFilesToDB = async (directoryPath) => {
  const files = fs.readdirSync(directoryPath);
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await saveFilesToDB(filePath);
    } else {
      const fileType = path.extname(file).substring(1);
      const newFile = new File({
        filename: file,
        fileType,
        filePath: filePath,
      });
      await newFile.save();
    }
  }
};

// POST route to handle file uploads
app.post('/upload', upload.array('files', 100), async (req, res) => {
  try {
    await saveFilesToDB(uploadPath);
    res.send('Files uploaded successfully');
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).send('Error uploading files');
  }
});

// GET route to fetch distinct file types
app.get('/file-types', async (req, res) => {
  try {
    const fileTypes = await File.distinct('fileType');
    res.json(fileTypes);
  } catch (err) {
    console.error('Error fetching file types:', err);
    res.status(500).send('Error fetching file types');
  }
});

// GET route to fetch files by type
app.get('/files', async (req, res) => {
  const { type } = req.query;
  try {
    const files = await File.find({ fileType: type });
    res.json(files);
  } catch (err) {
    console.error(`Error fetching files of type ${type}:`, err);
    res.status(500).send(`Error fetching files of type ${type}`);
  }
});

// GET route to fetch folder structure
app.get('/folder-structure', (req, res) => {
  const walkDir = (dir) => {
    const results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results.push({
          name: file,
          children: walkDir(filePath),
        });
      } else {
        results.push({
          name: file,
          path: filePath,
        });
      }
    });
    return results;
  };

  try {
    const structure = walkDir(uploadPath);
    res.json(structure);
  } catch (err) {
    console.error('Error fetching folder structure:', err);
    res.status(500).send('Error fetching folder structure');
  }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
