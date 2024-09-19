import express from 'express';
import { isVideoNew, setVideo } from "./firestore";
import { 
  uploadProcessedVideo,
  downloadRawVideo,
  deleteRawVideo,
  deleteProcessedVideo,
  convertVideo,
  setupDirectories
} from './storage';

// Create the local directories for videos
setupDirectories();

const app = express();
app.use(express.json());

// Process a video file from Cloud Storage into 360p
app.post('/process-video', async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return res.status(400).send('Bad Request: missing or invalid filename.');
  }

  const inputFileName = data.name; // In format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  try {
    if (!await isVideoNew(videoId)) {
      return res.status(400).send('Bad Request: video already processing or processed.');
    }

    // Set the video status to 'processing'
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: 'processing'
    });

    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Add your video processing logic here (e.g., converting video)
    await convertVideo(inputFileName, outputFileName);

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    // Update video status to 'processed'
    await setVideo(videoId, {
      status: 'processed',
      filename: outputFileName
    });

    // Clean up by deleting the raw and processed videos
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Processing finished successfully');
  } catch (error) {
    console.error('Error processing video:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// Get the PORT from the environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
