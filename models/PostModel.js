import mongoose, { Types } from "mongoose";

const PostSchema=new mongoose.Schema({

    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
           
            },
        },
    ],

},{timestamps:true})

export default mongoose.model("Post",PostSchema)