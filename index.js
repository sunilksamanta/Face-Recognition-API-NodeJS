require('@tensorflow/tfjs-node');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { loadModels, faceDetectionOptions } = require('./commons');
const mongoose = require('mongoose');
const Face = require('./FaceModel');
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const canvas = require('canvas');
const faceapi = require('@vladmandic/face-api');


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load face-api models
loadModels().then(() => {
  console.log('Models loaded successfully');
}).catch(err => {
  console.error('Failed to load models:', err);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
// API endpoint to register a face
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const img = await canvas.loadImage(req.file.buffer);
    const detections = await faceapi.detectSingleFace(img, faceDetectionOptions)
                                   .withFaceLandmarks()
                                   .withFaceDescriptor();
    if (!detections) {
      return res.status(400).send('No faces detected.');
    }
    const descriptors = Array.from(detections.descriptor);
    const face = new Face({
      name: req.body.name,
      descriptors: descriptors
    });
    console.log("Length of descriptors before saving:", descriptors.length);


    
    await face.save();
    res.json({ message: 'Face registered successfully for ' + req.body.name });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// API endpoint to recognize a face
app.post('/recognize', upload.single('image'), async (req, res) => {
  try {
    const img = await canvas.loadImage(req.file.buffer);
    const detections = await faceapi.detectSingleFace(img, faceDetectionOptions)
                                   .withFaceLandmarks()
                                   .withFaceDescriptor();
    if (!detections) {
      return res.status(400).send('No faces detected.');
    }

    const faces = await Face.find().lean();
    console.log(faces);
    // After retrieving
    faces.forEach(face => {
        console.log(`Length of descriptors for ${face.name}:`, new Float32Array(face.descriptors).length);
    });
    const faceMatcher = new faceapi.FaceMatcher(
        faces.map(f => new faceapi.LabeledFaceDescriptors(
          f.name,
          [new Float32Array(f.descriptors)]
        ))
      );
    console.log(faceMatcher);
    const bestMatch = faceMatcher.findBestMatch(Array.from(detections.descriptor));
    console.log(bestMatch._label);
    res.json({
        name: bestMatch._label,
        distance: bestMatch._distance
    })
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Server start
const PORT = 3100 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
