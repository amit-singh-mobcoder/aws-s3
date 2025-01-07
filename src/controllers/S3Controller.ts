import { AwsS3FolderNames } from "@src/constants";
import awsS3Service from "@src/services/aws/S3Service";
import { Request, Response } from "express";

interface IS3Controller {
  getPutObjectSignedUrl(req: Request, res: Response): Promise<void>;
}

export class S3Controller implements IS3Controller {
  getPutObjectSignedUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileName, expireTime } = req.query;
      const key = `${AwsS3FolderNames.avatars}/${Date.now()}-${fileName}`;
      const maxFileSize = 2 * 1024 * 1024; // in bytes
      const url = await awsS3Service.getPutObjectUrl(key, maxFileSize, Number(expireTime));
      res.status(200).json({
        success: true,
        message: "To Upload file presigned url generated successfully",
        url,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error while getting put object pre-signed url",
        error,
      });
    }
  };
}
