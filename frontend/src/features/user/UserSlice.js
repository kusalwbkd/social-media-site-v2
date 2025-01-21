import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/customFetch';
import { LikeUnlikePostAction } from '../post/PostSlice';

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }
  return null;
};


const initialState = {
  isLoading: false,
  isSignupSuccess: false,
  AllUsers: [],
  user: getUserFromLocalStorage(),
  userProfile: getUserFromLocalStorage(),
  suggestedUsers: [],



}

export const loginUserAction = createAsyncThunk('user/loginUser', async (user, thunkAPI) => {
  try {
    const resp = await customFetch.post('/auth/login', user);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);

  }
})

export const registerUserAction = createAsyncThunk('user/registernUser', async (user, thunkAPI) => {
  try {
    const resp = await customFetch.post('/auth/signup', user);

    return resp.data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);

  }
})

export const getAllUsersAction = createAsyncThunk('user/allusers', async (__dirname, thunkAPI) => {
  try {
    const response = await customFetch.get('/users')
    console.log("from all users action", response.data);


    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);

  }
})

export const getUsersAction = createAsyncThunk('user/getusers', async (user, thunkAPI) => {
  try {
    const response = await customFetch.get(`/users/profile/${user}`)


    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);

  }
})

export const followUnfollowAction = createAsyncThunk('user/followUnfollow', async (user, thunkAPI) => {
  try {
    const response = await customFetch.post(`/users/follow/${user}`)
    return response.data

  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
})

export const updateUserAction = createAsyncThunk('user/update', async (user, thunkAPI) => {
  try {
    const response = await customFetch.patch('/users/update', user)
    console.log(response.data);
    return response.data

  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
})

export const updateUserImages = createAsyncThunk('user/updateImages', async (user, thunkAPI) => {

  
  
   try {
    const response = await customFetch.patch('/users/updateImages', user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data


  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);

  } 
})


const UserSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {

    //loginUserAction
    builder.addCase(loginUserAction.pending, (state) => {
      state.isLoading = true;
    }).addCase(loginUserAction.fulfilled, (state, action) => {
      const { user } = action.payload
      state.isLoading = false;
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      toast.success(`Hello There ${user.username}`);
    }).addCase(loginUserAction.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);

      //registerUserAction
    }).addCase(registerUserAction.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(registerUserAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSignupSuccess = true
      toast.success(`Registered successfully please login....`);
    }).addCase(registerUserAction.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);

      //getAllUsersAction
    }).addCase(getAllUsersAction.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(getAllUsersAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.AllUsers = action.payload.users
    }).addCase(getAllUsersAction.rejected, (state, action) => {
      state.isLoading = false
      toast.error(action.payload);
    }).

      addCase(getUsersAction.pending, (state, action) => {
        state.isLoading = true
      }).addCase(getUsersAction.fulfilled, (state, action) => {
        state.isLoading = false
        state.userProfile = action.payload.user
      }).addCase(getUsersAction.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload);

      }).addCase(LikeUnlikePostAction.fulfilled, (state, action) => {

        state.user = action.payload.user;

      }).

      addCase(followUnfollowAction.pending, (state, action) => {
        state.isLoading = true
      }).addCase(followUnfollowAction.fulfilled, (state, action) => {


        state.isLoading = false
       // state.AllUsers = action.payload.users
       const usersMap = new Map();
       action.payload.users.forEach(user => usersMap.set(user._id, user));
       state.AllUsers = Array.from(usersMap.values());
        state.user = {
          ...state.user,
          following: action.payload.user.following,
        };
        state.userProfile = {
          ...state.userProfile,
          followers: action.payload.modifiedUser.followers,
        }

        localStorage.setItem('user', JSON.stringify({
          ...state.user,
          following: action.payload.user.following,
        }));
       state.suggestedUsers = state.AllUsers.filter((user) =>user._id !== action.payload.user._id && !user.followers.includes(action.payload.user._id)).slice(0, 4)


        toast.info('User followed/unfollowed....')
      }).addCase(followUnfollowAction.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload);

      }).addCase(updateUserAction.pending, (state, action) => {
        state.isLoading = true
      }).addCase(updateUserAction.fulfilled, (state, action) => {
        state.isLoading = false
        const existringUsers = state.AllUsers.filter((user) => user._id !== action.payload.updatedUser._id)
        state.AllUsers = [action.payload.updatedUser, ...existringUsers]
        state.user = action.payload.updatedUser
        state.userProfile = action.payload.updatedUser
        localStorage.setItem('user', JSON.stringify(state.user));
        toast.info(`profile updated!!`);

      }).addCase(updateUserAction.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload);
      }) .addCase(updateUserImages.pending, (state, action) => {
        state.isLoading = true
      }).addCase(updateUserImages.fulfilled, (state, action) => {
        state.isLoading = false
        const existringUsers = state.AllUsers.filter((user) => user._id !== action.payload.updatedUser._id)
        state.AllUsers = [action.payload.updatedUser, ...existringUsers]
        state.user = action.payload.updatedUser
        state.userProfile = action.payload.updatedUser
        localStorage.setItem('user', JSON.stringify(state.user));
        toast.info(`profile updated!!`);

      }).addCase(updateUserImages.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload);
      })

 

  },


  reducers: {

    logoutUser: (state, { payload }) => {
      state.user = null;
      localStorage.removeItem('user');
      if (payload) {
        toast.success(payload);
      }
      //toast.success('Logged out successfully');
    },

    getSuggestedUsers: (state, { payload }) => {
      const { userId } = payload

      if (state.AllUsers.length > 0) {
        state.suggestedUsers = state.AllUsers.filter((user) =>user._id !== userId && !user.followers.includes(userId)).slice(0, 4)


      }
    },

  }
});


export const { logoutUser, getSuggestedUsers } = UserSlice.actions;
export default UserSlice.reducer;