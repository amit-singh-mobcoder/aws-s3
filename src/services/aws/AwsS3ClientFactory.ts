import { S3Client } from "@aws-sdk/client-s3";
import { IAwsS3Config } from "@src/config/aws/S3Config";

export interface IAwsS3ClientFactory {
  createS3Client(config: IAwsS3Config): S3Client;
}

class AwsS3ClientFactory implements IAwsS3ClientFactory {
  createS3Client(config: IAwsS3Config): S3Client {
    return new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
}

export default AwsS3ClientFactory;
