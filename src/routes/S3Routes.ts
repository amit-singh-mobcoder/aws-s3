import express, { RequestHandler } from "express";
import { S3Controller } from "@src/controllers/S3Controller";

const router = express.Router();
const s3Controller = new S3Controller();

router.route("/").get(s3Controller.getPutObjectSignedUrl as RequestHandler);

export default router;
