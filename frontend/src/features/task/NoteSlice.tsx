import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { NotesByColumn, INote, Id, NewNote } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import {
  createErrorToast,
  createSuccessToast,
  createInfoToast,
} from "features/toast/ToastSlice";
import api, { API_SORT_NOTES, API_NOTES } from "api";
import { addColumn, deleteColumn } from "features/column/ColumnSlice";
import { deleteLabel } from "features/label/LabelSlice";

type NotesById = Record<string, INote>;

interface InitialState {
  byColumn: NotesByColumn;
  byId: NotesById;
  createLoading: boolean;
  createNoteDialogOpen: boolean;
  createNoteDialogColumn: Id | null;
  editNoteDialogOpen: Id | null;
}

export const initialState: InitialState = {
  byColumn: {},
  byId: {},
  createLoading: false,
  createNoteDialogOpen: false,
  createNoteDialogColumn: null,
  editNoteDialogOpen: null,
};

interface PatchFields {
  description: string;
  labels: Id[];
}

export const patchNote = createAsyncThunk<
  INote,
  { id: Id; fields: Partial<PatchFields> }
>("note/patchNoteStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_NOTES}${id}/`, fields);
  return response.data;
});

interface CreateNoteResponse extends INote {
  column: Id;
}

export const createNote = createAsyncThunk<
  CreateNoteResponse,
  NewNote,
  {
    rejectValue: string;
  }
>("note/createNoteStatus", async (task, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post(`${API_NOTES}`, task);
    dispatch(createSuccessToast("Note created"));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteNote = createAsyncThunk<Id, Id>(
  "note/deleteNoteStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_NOTES}${id}/`);
    dispatch(createInfoToast("Note deleted"));
    return id;
  }
);

export const slice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNotesByColumn: (state, action: PayloadAction<NotesByColumn>) => {
      state.byColumn = action.payload;
    },
    setEditNoteDialogOpen: (state, action: PayloadAction<Id | null>) => {
      state.editNoteDialogOpen = action.payload;
    },
    setCreateNoteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createNoteDialogOpen = action.payload;
    },
    setCreateNoteDialogColumn: (state, action: PayloadAction<Id>) => {
      state.createNoteDialogColumn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const byColumn: NotesByColumn = {};
      const byId: NotesById = {};
      for (const col of action.payload.columns) {
        for (const note of col.notes) {
          byId[note.id] = note;
        }
        //byColumn[col.id] = col.notes.map((t) => t.id);
      }
      state.byColumn = byColumn;
      state.byId = byId;
    });
    builder.addCase(patchNote.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
    });
    builder.addCase(createNote.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createNote.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
      //state.byColumn[action.payload.column].push(action.payload.id);
      state.createNoteDialogOpen = false;
      state.createLoading = false;
    });
    builder.addCase(createNote.rejected, (state) => {
      state.createLoading = false;
    });
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      for (const [column, tasks] of Object.entries(state.byColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === action.payload) {
            state.byColumn[column].splice(i, 1);
          }
        }
      }
      delete state.byId[action.payload];
    });
    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.byColumn[action.payload.id] = [];
    });
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      delete state.byColumn[action.payload];
    });
    builder.addCase(deleteLabel.fulfilled, (state, action) => {
      const deletedLabelId = action.payload;
      for (const taskId in state.byId) {
        const task = state.byId[taskId];
        task.labels = task.labels.filter(
          (labelId) => labelId !== deletedLabelId
        );
      }
    });
  },
});

export const {
  setNotesByColumn,
  setCreateNoteDialogOpen,
  setCreateNoteDialogColumn,
  setEditNoteDialogOpen,
} = slice.actions;

export const updateNotesTasksByColumn = (
  notesByColumn: NotesByColumn
): AppThunk => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  // const previousNotesByColumn = state.item.byColumn;
  const boardId = state.board.detail?.id;
  try {
    dispatch(setNotesByColumn(notesByColumn));
    await api.post(API_SORT_NOTES, {
      board: boardId,
      notes: notesByColumn,
      order: Object.values(notesByColumn).flat(),
    });
  } catch (err) {
    // dispatch(setNotesByColumn(previousNotesByColumn));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
