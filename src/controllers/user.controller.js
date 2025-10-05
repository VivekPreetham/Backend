import asyncHandler from "./utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists
    // check for images, check for avatar
    // upload images to cloudinary, avatar,
    // create user object - create entry in db
    // check for user creation
    // return response


    const { username, email, password, fullname } = req.body;
    console.log("email: ", email);
    
    if(
        [username, email,, password, fullname].some((field) => field?.trim() === "")
    )   {
            throw new ApiError(400, "All fields are required")
        }

    const existedUser = await User.findOne(
        { $or: [{email}, {username}]}
    )
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    };

    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        fullname: fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url,
        password,
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Somwthing went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});

export { registerUser };