import { S3Uploader } from '@shoutem/web-core';

/**
 * Extension of S3Uploader class that doesn't delete asset on S3.
 * This is a temporary fix waiting for SEEXT-4604.
 */
export default class UndeletableS3Uploader extends S3Uploader {
  deleteFile() {
    return Promise.resolve();
  }
}
