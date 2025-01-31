import { loadState, saveState } from "./utils/localStorage";
import { Action, configureStore, combineReducers } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";

import authReducer from "./features/auth/AuthSlice";
import profileReducer from "./features/profile/ProfileSlice";
import toastReducer from "./features/toast/ToastSlice";
import boardReducer from "./features/board/BoardSlice";
import columnReducer from "./features/column/ColumnSlice";
import columnItemReducer from "./features/task/ColumnItemSlice";
import commentReducer from "./features/comment/CommentSlice";
import questionCommentReducer from "./features/questioncomment/QuestionCommentSlice";
import labelReducer from "./features/label/LabelSlice";
import memberReducer from "./features/member/MemberSlice";
import responsiveReducer from "./features/responsive/ResponsiveSlice";

import authInitialState from "./features/auth/AuthSlice";
import { setupInterceptors } from "api";

export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  toast: toastReducer,
  board: boardReducer,
  column: columnReducer,
  comment: commentReducer,
  questionComment: questionCommentReducer,
  member: memberReducer,
  label: labelReducer,
  responsive: responsiveReducer,
  item: columnItemReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: loadState() || {},
  reducer: rootReducer,
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    auth: {
      ...authInitialState,
      user: state.auth.user,
    },
  });
});

setupInterceptors(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
