import multer from "multer";

const storage = multer.memoryStorage(); // we will upload from buffer to cloudinary
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

export default upload;
