import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api, { API_QUESTIONCOMMENTS } from "api";
import { AxiosResponse } from "axios";
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from "features/toast/ToastSlice";
import { RootState } from "store";
import { Id, NewQuestionComment, Status, QuestionComment } from "types";

export const fetchComments = createAsyncThunk<QuestionComment[], number>(
  "comment/fetchCommentsStatus",
  async (questionId, { dispatch }) => {
    try {
      const response: AxiosResponse<QuestionComment[]> = await api.get(
        `${API_QUESTIONCOMMENTS}?question=${questionId}`
      );
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        dispatch(createErrorToast(err.message));
      }
      return [];
    }
  }
);

export const createComment = createAsyncThunk<
  QuestionComment | undefined,
  NewQuestionComment
>("comment/createCommentStatus", async (comment, { dispatch }) => {
  try {
    const response: AxiosResponse<QuestionComment> = await api.post(
      API_QUESTIONCOMMENTS,
      comment
    );
    dispatch(createSuccessToast("Comment posted"));
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      dispatch(createErrorToast(err.message));
    }
  }
});

export const deleteComment = createAsyncThunk<Id | undefined, Id>(
  "task/deleteCommentStatus",
  async (id, { dispatch }) => {
    try {
      await api.delete(`${API_QUESTIONCOMMENTS}${id}/`);
      dispatch(createInfoToast("Comment deleted"));
      return id;
    } catch (err) {
      if (err instanceof Error) {
        dispatch(createErrorToast(err.message));
      }
    }
  }
);

const commentAdapter = createEntityAdapter<QuestionComment>({
  sortComparer: (a, b) => b.created.localeCompare(a.created),
});

interface ExtraInitialState {
  fetchCommentsStatus: Status;
  createCommentStatus: Status;
}

export const initialState = commentAdapter.getInitialState<ExtraInitialState>({
  fetchCommentsStatus: "idle",
  createCommentStatus: "idle",
});

export const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.fetchCommentsStatus = "loading";
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      commentAdapter.addMany(state, action.payload);
      state.fetchCommentsStatus = "succeeded";
    });
    builder.addCase(createComment.pending, (state) => {
      state.createCommentStatus = "loading";
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      commentAdapter.addOne(state, action.payload as QuestionComment);
      state.createCommentStatus = "succeeded";
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      commentAdapter.removeOne(state, action.payload as Id);
    });
  },
});

// selectors
export const { selectAll: selectAllComments } = commentAdapter.getSelectors(
  (state: RootState) => state.questionComment
);
export const selectFetchCommentsStatus = (state: RootState) =>
  state.comment.fetchCommentsStatus;
export const selectCreateCommentStatus = (state: RootState) =>
  state.comment.createCommentStatus;

export default slice.reducer;
