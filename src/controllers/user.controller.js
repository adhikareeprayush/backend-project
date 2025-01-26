import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res)=> {
    // get user details from frontend
    const {fullname, email, username, password} = req.body
    console.log("email", email);

    // validation - not empty
    if(
        [fullname, email, username, password].some((field)=> field?.trim() === "")
    ) {
        throw new ApiError(400, "Please fill in all fields");
    }

    // check if user already exists: username, email
    User.findOne({$or: [{email},{username}]}, (error, user) => {
        if(error) {
            throw new ApiError(400, "An error occurred");
        }
        if(user) {
            throw new ApiError(409, "User already exists");
        }
    });

    // check for images, check for avatar
    const avatarLocalPath = req.files.avatar ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files.coverImage ? req.files.coverImage[0].path : null;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Please upload an avatar");
    }

    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if(!avatar) {
        throw new ApiError(500, "An error occurred while uploading avatar");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    
    // check for user creation
    if(!createdUser) {
        throw new ApiError(500, "An error occurred while creating user");
    }

    // return res
    return res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"));

})

export {registerUser};