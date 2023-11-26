import { Storage } from '@google-cloud/storage';
import 'dotenv/config';

// Creates a client using the credentials set in the environment variable
const storage = new Storage();

async function uploadImageAndGetURL(filename) {
  const bucketName = 'deadbird';
  const bucket = storage.bucket(bucketName);

  // Uploads a file to the bucket
  await bucket.upload(filename, {
    gzip: true,
    metadata: {
      // Enable long-lived HTTP caching headers
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${filename} uploaded to ${bucketName}.`);

  // The public URL can be used to directly access the file via HTTP.
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

  return publicUrl;
}

// Replace 'local-image-path.jpg' with the path to the image file you want to upload
uploadImageAndGetURL('/Users/fahadfaruqi/Dropbox/Wallpapers/joji.png')
  .then(url => console.log(`Public URL: ${url}`))
  .catch(console.error);
