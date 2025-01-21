import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    username: {
        type: String,
       
    },
    fullName: {
        type: String,
        
    },
    password: {
        type: String,
      
    },
    email: {
        type: String,
       
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },

    link: {
        type: String,
        default: "",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
},{timestamps:true})

export default mongoose.model("User",UserSchema)