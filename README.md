# Face Recognition API

## Overview
This project is a Node.js application that uses `face-api.js` for face recognition tasks, backed by MongoDB for storage. It provides endpoints for registering faces with associated names and recognizing faces from uploaded images.

## Features
- **Face Registration**: Upload an image to register a face with a name.
- **Face Recognition**: Upload an image to recognize a face and retrieve the associated name.

## Technologies Used
- Node.js
- MongoDB
- `face-api.js`
- Express.js
- Canvas

## Prerequisites
- Node.js installed (v14 or newer)
- MongoDB running locally or remotely
- npm or yarn for managing packages

## Installation

Clone the repository to your local machine:

Then run the following

```bash
cd face-recognize-api
npm i
```
Create an `.env` file in the root of the project and put the `MONGODB_URI` inside that

```bash
MONGODB_URI=mongodb://localhost:27017/face_recog
PORT=5000
```

## Request

### Create User with Image

```bash
METHOD: POST
URI: http://localhost:5000/upload
BODY TYPE: Formdata
FIELDS:
  name   : String
  image  : File
```

### Recognize User

```bash
METHOD: POST
URI: http://localhost:5000/recognize
BODY TYPE: Formdata
FIELDS:
  image  : File
```
