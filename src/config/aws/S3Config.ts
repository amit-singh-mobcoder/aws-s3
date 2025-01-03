export interface IAwsS3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

class AwsS3Config implements IAwsS3Config {
  public region;
  public accessKeyId;
  public secretAccessKey;

  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }
}

export default AwsS3Config;
