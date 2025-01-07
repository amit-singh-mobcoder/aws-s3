import express from "express";
import userRoutes from "./UserRoutes";
import s3Routes from "./S3Routes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/s3", s3Routes);

export default router;
