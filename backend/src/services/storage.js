/**
 * Storage service: local filesystem (dev) or AWS S3 + CloudFront (production).
 * Set AWS env vars to use S3; otherwise uploads go to ./uploads.
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';

const S3_BUCKET = process.env.S3_BUCKET;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN; // e.g. d1234abcd.cloudfront.net (no https://)
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

export function isS3Enabled() {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    S3_BUCKET &&
    CLOUDFRONT_DOMAIN
  );
}

function getS3Client() {
  if (!isS3Enabled()) return null;
  return new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Get S3 key prefix (folder) from mimetype: images | videos | documents
 */
function getFolderForMimetype(mimetype) {
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype.startsWith('image/')) return 'images';
  return 'documents';
}

/**
 * Upload a file buffer to S3 and return the CloudFront URL.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - e.g. image/jpeg
 * @param {string} filename - Stored filename (e.g. 1234567890-photo.jpg)
 * @returns {{ url: string, key: string }}
 */
export async function uploadToS3(buffer, mimetype, filename) {
  const client = getS3Client();
  if (!client) throw new Error('S3 is not configured');

  const folder = getFolderForMimetype(mimetype);
  const key = `${folder}/${filename}`;

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  const baseUrl = CLOUDFRONT_DOMAIN.startsWith('http')
    ? CLOUDFRONT_DOMAIN
    : `https://${CLOUDFRONT_DOMAIN}`;
  const url = `${baseUrl.replace(/\/$/, '')}/${key}`;

  return { url, key };
}

/**
 * Delete a file from S3 by filename (we try images/, videos/, documents/).
 * @param {string} filename - e.g. 1234567890-photo.jpg
 * @returns {boolean} - true if deleted, false if not found
 */
export async function deleteFromS3(filename) {
  const client = getS3Client();
  if (!client) throw new Error('S3 is not configured');

  const folders = ['images', 'videos', 'documents'];
  for (const folder of folders) {
    const key = `${folder}/${filename}`;
    try {
      await client.send(
        new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key })
      );
      await client.send(
        new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key })
      );
      return true;
    } catch (e) {
      const notFound = e.name === 'NotFound' || e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404;
      if (notFound) continue;
      throw e;
    }
  }
  return false;
}
