import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // file has been uploaded successfully
        console.log("File uploaded successfully",response.url);
        return response;
    } catch(error) {
        // remove the locally saved file if upload is failed
        fs.unlinkSync(localFilePath);
        console.log("Error while uploading file on cloudinary",error);
        return null;
    }
}

export { uploadOnCloudinary };