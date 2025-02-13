import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsersAction, getSuggestedUsers } from "../features/user/UserSlice";
import { getAllPostsAction, getFeedPosts } from "../features/post/PostSlice";
import { useEffect } from "react";
import { RightPanel, Sidebar } from "../components";
//some changes
const Home = () => {
  const { user, AllUsers, suggestedUsers } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  useEffect(() => {
    if(user === undefined){
      return
    }
    if (!user) {
      toast.dismiss();
      toast.error('please login');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(getAllUsersAction()); 
      dispatch(getAllPostsAction()); 
    }
  }, [user, dispatch]);
  

  useEffect(() => {
    if (user?._id && AllUsers?.length > 0) {
      dispatch(getSuggestedUsers({ userId: user._id }));
    }
  }, [user?.following, AllUsers, dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getFeedPosts());
    }
  }, [user?.followers, dispatch]);
  

  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        <Sidebar />
        <Outlet />
        <RightPanel suggestedUsers={suggestedUsers} />
      </div>
    </>
  );
};

export default Home