import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import customFetch from "../../utils/customFetch"

const initialState = {
    isLoading: false,
    posts: [],
    userPosts: [],
    likedPosts: [],
    feedPosts: [],
    postSuccess: false,
    singlePost: {}

}

export const getAllPostsAction = createAsyncThunk('post/allposts', async (_, thunkAPI) => {
    try {
        const response = await customFetch.get('/posts/all')


        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);

    }

})

export const getFeedPosts = createAsyncThunk('post/feedPosts', async (_, thunkAPI) => {
    try {
        const response = await customFetch.get('/posts/following')
        console.log("from getdeed", response.data);

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);

    }

})

export const createPostAction = createAsyncThunk('post/createPost', async (post, thunkAPI) => {

  

    try {
        const response = await customFetch.post('/posts/create', post, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })


        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);

    }

})

export const deletePostAction = createAsyncThunk('post/delete', async (post, thunkAPI) => {


    try {
        const response = await customFetch.delete(`/posts/${post}`)
        return response.data

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }

})

export const addCommentAction = createAsyncThunk('post/comment', async (comment, thunkAPI) => {
    const { id, text } = comment

    try {
        const response = await customFetch.post(`/posts/comment/${id}`, { text })
        return response.data

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }

})

export const LikeUnlikePostAction = createAsyncThunk('post/likeUnLike', async (post, thunkAPI) => {
    try {
        const response = await customFetch.post(`/posts/like/${post}`)
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const SinglePostAction = createAsyncThunk('post/singlePost', async (post, thunkAPI) => {


    try {
        const response = await customFetch.get(`/posts/${post}`)
        console.log("single post", response.data);
        return response.data


    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const UpdatePostAction = createAsyncThunk('post/update', async (post, thunkAPI) => {


    const { id, text, img } = post;

    try {

        const formData = new FormData();
        formData.append('text', text);
        if (img) {
            formData.append('img', img);
        } else {
            formData.append('img', '');
        }
        const response = await customFetch.patch(`/posts/${id}`,formData, {
          
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })



        return response.data

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }


})
export const resetPostSuccessFlag = () => (dispatch) => {
    dispatch({ type: 'RESET_POST_SUCCESS_FLAG' });
}


const PostSlice = createSlice({
    name: 'post',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllPostsAction.pending, (state, action) => {
            state.isLoading = true
        }).addCase(getAllPostsAction.fulfilled, (state, action) => {
            state.isLoading = false
            state.posts = action.payload.posts
        }).addCase(getAllPostsAction.rejected, (state, action) => {
            state.isLoading = false
            toast.error(action.payload);

        }).addCase(getFeedPosts.pending, (state, action) => {
            state.isLoading = true
        }).addCase(getFeedPosts.fulfilled, (state, action) => {
            state.isLoading = false
            state.feedPosts = action.payload.feedPosts
        }).addCase(getFeedPosts.rejected, (state, action) => {
            state.isLoading = false
            toast.error(action.payload);

        }).addCase(createPostAction.pending, (state, action) => {
            state.isLoading = true
        }).addCase(createPostAction.fulfilled, (state, action) => {


            state.isLoading = false
            //  state.postSuccess = true
            state.posts = [action.payload.post, ...state.posts];
            state.userPosts = [action.payload.post, ...state.userPosts];

            toast.success('post created succesfully');
        }).addCase(createPostAction.rejected, (state, action) => {
            state.isLoading = false
            toast.error(action.payload);
        }).addCase('RESET_POST_SUCCESS_FLAG', (state) => {
            state.postSuccess = false;
        })
            .addCase(deletePostAction.pending, (state, actions) => {
                state.isLoading = true
            }).addCase(deletePostAction.fulfilled, (state, action) => {


                state.isLoading = false
                state.posts = action.payload.remaningPosts;
                state.userPosts = action.payload.remaningPosts;
                toast.success('post deleted succesfully');
            }).addCase(deletePostAction.rejected, (state, action) => {
                state.isLoading = false
                toast.error(action.payload);
            })
            .addCase(LikeUnlikePostAction.pending, (state, actions) => {
                state.isLoading = true
            }).addCase(LikeUnlikePostAction.fulfilled, (state, action) => {
                state.isLoading = false
                state.posts = action.payload.remaningPosts;
                state.userPosts = action.payload.remaningPosts

            }).addCase(LikeUnlikePostAction.rejected, (state, action) => {
                state.isLoading = false
                toast.error(action.payload);
            }).addCase(addCommentAction.pending, (state, actions) => {
                state.isLoading = true
            }).addCase(addCommentAction.fulfilled, (state, action) => {


                state.isLoading = false


                state.posts = action.payload.remaningPosts;
                state.userPosts = action.payload.remaningPosts
                toast.success("commented");

            }).addCase(addCommentAction.rejected, (state, action) => {
                state.isLoading = false
                toast.error(action.payload);
            }).addCase(SinglePostAction.pending, (state, actions) => {
                state.isLoading = true
            }).addCase(SinglePostAction.fulfilled, (state, action) => {
                state.isLoading = false
                state.singlePost = action.payload.post;


            }).addCase(SinglePostAction.rejected, (state, action) => {
                state.isLoading = false
                toast.error(action.payload);
            }).addCase(UpdatePostAction.pending, (state, actions) => {
                state.isLoading = true
            }).addCase(UpdatePostAction.fulfilled, (state, action) => {
                state.isLoading = false
                state.posts = action.payload.remaningPosts;
                state.userPosts = action.payload.remaningPosts
                state.singlePost = action.payload.updatedPost
                state.postSuccess = true
                toast.warn('post updated!!!')
            }).addCase(UpdatePostAction.rejected, (state, action) => {
                state.isLoading = false
                toast.error(action.payload);
            })


    },
    reducers: {
        getUserPosts: (state, action) => {
            const { username } = action.payload

            if (state.posts.length > 0) {
                state.userPosts = state.posts.filter((post) => post.user.username === username);
            }
        },
        getLikedPosts: (state, action) => {
            const { user } = action.payload;
            if (state.posts.length > 0) {
                const likedArray = user.likedPosts;

                state.likedPosts = likedArray
                    .map((postId) => state.posts.find((post) => post._id === postId))
                    .filter((post) => post !== undefined);
            } else {
                state.likedPosts = [];
            }
        },





    }

})
export const { getUserPosts, getLikedPosts } = PostSlice.actions;

export default PostSlice.reducer
