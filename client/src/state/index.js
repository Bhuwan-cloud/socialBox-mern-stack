import { createSlice } from "@reduxjs/toolkit";

// crataing a global state 
const initalState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initalState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friend does not exist");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedposts = state.posts.map(
                (post) => {
                    if (post._id === action.payload.user_id) return action.payload.post;
                    return post;
                }
            );

            state.posts = updatedposts;
        }
    }
});

export const { setMode, setFriends, setLogin, setLogout, setPost, setPosts } = authSlice.actions;
export default authSlice.reducer;