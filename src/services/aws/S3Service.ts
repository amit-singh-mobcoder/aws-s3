import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { logger } from "@src/utils/logging";
import config from "@src/config";
import { IAwsS3ClientFactory } from "./AwsS3ClientFactory";
import { IAwsS3Config } from "@src/config/aws/S3Config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface IS3Service {
  uploadFileToS3(fileName: string, file: any): Promise<PutObjectCommandOutput>;
  getFileUrlFromAws(filename: string, expiresTime?: number | null): Promise<string | undefined>;
  deleteFileFromS3(filename: string): Promise<DeleteObjectCommandOutput | undefined>;
}

class S3Service implements IS3Service {
  private s3Client: S3Client;

  constructor(awsS3ClientFactory: IAwsS3ClientFactory, config: IAwsS3Config) {
    this.s3Client = awsS3ClientFactory.createS3Client(config);
  }

  public async uploadFileToS3(fileName: string, file: any): Promise<PutObjectCommandOutput> {
    try {
      const uploadParams = {
        Bucket: config.amazonS3.awsBucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      return await this.s3Client.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      logger.error(`Failed to upload file to S3, Error: ${error}`);
      throw error;
    }
  }

  public async getFileUrlFromAws(filename: string, expiresTime?: number): Promise<string> {
    try {
      // Check if the file exists in the AWS bucket
      const isFileExist = await this.isFileAvailableInAwsBucket(filename);
      if (!isFileExist) {
        throw new Error(`File "${filename}" does not exist in the AWS bucket.`);
      }

      // Create the GetObjectCommand
      const command = new GetObjectCommand({
        Bucket: config.amazonS3.awsBucketName,
        Key: filename,
      });

      // Generate signed URL
      const url = await getSignedUrl(this.s3Client, command, expiresTime ? { expiresIn: expiresTime } : {});
      return url;
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error while generating file URL for "${filename}": ${err.message}`);
      } else {
        logger.error(`Unexpected error type while generating file URL for "${filename}": ${JSON.stringify(err)}`);
      }
      throw err;
    }
  }

  public async deleteFileFromS3(filename: string): Promise<DeleteObjectCommandOutput | undefined> {
    try {
      // check is file exists in bucket
      const isFileExist = await this.isFileAvailableInAwsBucket(filename);
      if (!isFileExist) {
        throw new Error("File does not exists in aws bucket.");
      }
      const uploadParam = {
        Bucket: config.amazonS3.awsBucketName,
        Key: filename,
      };

      return await this.s3Client.send(new DeleteObjectCommand(uploadParam));
    } catch (error) {
      logger.error(`Something went wrong while deleting file from s3, Error: '${error}`);
      throw error;
    }
  }

  private async isFileAvailableInAwsBucket(fileName: string): Promise<boolean> {
    try {
      // Check if the object exists
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: config.amazonS3.awsBucketName,
          Key: fileName,
        }),
      );

      return true;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotFound") {
          // File not found in AWS bucket
          return false;
        } else {
          logger.error(`Failed to check file in AWS S3 bucket: ${err.message}`);
          throw err;
        }
      } else {
        logger.error(`Unexpected error type: ${JSON.stringify(err)}`);
        throw err;
      }
    }
  }
}

export default S3Service;
