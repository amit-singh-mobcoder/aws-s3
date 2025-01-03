import multer from "multer";
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: (_: Request, _file: Express.Multer.File, cb) => {
    cb(null, "./public/temp");
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });