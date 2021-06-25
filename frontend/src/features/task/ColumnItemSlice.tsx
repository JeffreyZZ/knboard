import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  OrderedItemsByColumn,
  OrderedItem,
  ItemsByColumn,
  IColumnItem,
  ITask,
  INote,
  Id,
  NewTask,
  NewNote,
  PriorityValue,
} from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import {
  createErrorToast,
  createSuccessToast,
  createInfoToast,
} from "features/toast/ToastSlice";
import api, { API_SORT_TASKS, API_TASKS, API_SORT_NOTES, API_NOTES } from "api";
import { addColumn, deleteColumn } from "features/column/ColumnSlice";
import { deleteLabel } from "features/label/LabelSlice";
import { removeBoardMember } from "features/member/MemberSlice";

type ItemsById = Record<string, IColumnItem>;

interface InitialState {
  byColumn: ItemsByColumn;
  byId: ItemsById;
  createLoading: boolean;
  createDialogOpen: boolean;
  createDialogColumn: Id | null;
  editDialogOpen: string | null;
  createNoteDialogOpen: boolean;
  createNoteDialogColumn: Id | null;
  editNoteDialogOpen: string | null;
}

export const initialState: InitialState = {
  byColumn: {},
  byId: {},
  createLoading: false,
  createDialogOpen: false,
  createDialogColumn: null,
  editDialogOpen: null,
  createNoteDialogOpen: false,
  createNoteDialogColumn: null,
  editNoteDialogOpen: null,
};

/////////////////
// Patch
/////////////////
interface PatchTaskFields {
  title: string;
  description: string;
  priority: PriorityValue;
  labels: Id[];
  assignees: Id[];
}

export const patchTask = createAsyncThunk<
  ITask,
  { id: Id; fields: Partial<PatchTaskFields> }
>("task/patchTaskStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_TASKS}${id}/`, fields);
  return response.data;
});

interface PatchNoteFields {
  description: string;
  labels: Id[];
}

export const patchNote = createAsyncThunk<
  INote,
  { id: Id; fields: Partial<PatchNoteFields> }
>("note/patchNoteStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_NOTES}${id}/`, fields);
  return response.data;
});

/////////////////
// Create
/////////////////
interface CreateTaskResponse extends ITask {
  column: Id;
}

export const createTask = createAsyncThunk<
  CreateTaskResponse,
  NewTask,
  {
    rejectValue: string;
  }
>("task/createTaskStatus", async (task, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post(`${API_TASKS}`, task);
    dispatch(createSuccessToast("Task created"));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
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

/////////////////
// Delete
/////////////////
export const deleteTask = createAsyncThunk<Id, Id>(
  "task/deleteTaskStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_TASKS}${id}/`);
    dispatch(createInfoToast("Task deleted"));
    return id;
  }
);

export const deleteNote = createAsyncThunk<Id, Id>(
  "note/deleteNoteStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_NOTES}${id}/`);
    dispatch(createInfoToast("Note deleted"));
    return id;
  }
);

export const slice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setTasksByColumn: (state, action: PayloadAction<ItemsByColumn>) => {
      state.byColumn = action.payload;
    },
    setCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createDialogOpen = action.payload;
    },
    setCreateDialogColumn: (state, action: PayloadAction<Id>) => {
      state.createDialogColumn = action.payload;
    },
    setEditDialogOpen: (state, action: PayloadAction<string | null>) => {
      state.editDialogOpen = action.payload;
    },
    setCreateNoteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createNoteDialogOpen = action.payload;
    },
    setCreateNoteDialogColumn: (state, action: PayloadAction<Id>) => {
      state.createNoteDialogColumn = action.payload;
    },
    setEditNoteDialogOpen: (state, action: PayloadAction<string | null>) => {
      state.editNoteDialogOpen = action.payload;
    },
    setNotesByColumn: (state, action: PayloadAction<ItemsByColumn>) => {
      state.byColumn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const byColumn: ItemsByColumn = {};
      const byId: ItemsById = {};
      let sortedItemInColumn: IColumnItem[] = [];

      for (const col of action.payload.columns) {
        // byId
        for (const task of col.tasks) {
          task.id = "T" + task.id;
          byId[task.id] = task;
        }
        for (const note of col.notes) {
          note.id = "N" + note.id;
          byId[note.id] = note;
        }
        // byColumn
        if (!byColumn[col.id]) {
          byColumn[col.id] = [];
        }
        sortedItemInColumn = [];
        col.tasks.map((t) => sortedItemInColumn.push(t as IColumnItem));
        col.notes.map((n) => sortedItemInColumn.push(n as IColumnItem));
        byColumn[col.id] = sortedItemInColumn
          .sort((a, b) => a.task_order - b.task_order)
          .map((i) => i.id);
      }
      state.byColumn = byColumn;
      state.byId = byId;
    });
    builder.addCase(patchTask.fulfilled, (state, action) => {
      const task: ITask = action.payload;
      task.id = "T" + task.id;
      state.byId[task.id] = task;
    });
    builder.addCase(createTask.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      const task: ITask = action.payload;
      task.id = "T" + task.id;
      state.byId[task.id] = task;
      state.byColumn[action.payload.column].push(task.id);
      state.createDialogOpen = false;
      state.createLoading = false;
    });
    builder.addCase(createTask.rejected, (state) => {
      state.createLoading = false;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      for (const [column, tasks] of Object.entries(state.byColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === "T" + action.payload) {
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
        const task = state.byId[taskId] as ITask;
        task.labels = task.labels.filter(
          (labelId) => labelId !== deletedLabelId
        );
      }
    });
    builder.addCase(removeBoardMember, (state, action) => {
      const deletedMemberId = action.payload;
      for (const taskId in state.byId) {
        const task = state.byId[taskId] as ITask;
        task.assignees = task.assignees.filter(
          (assigneeId) => assigneeId !== deletedMemberId
        );
      }
    });
    builder.addCase(patchNote.fulfilled, (state, action) => {
      const note: INote = action.payload;
      note.id = "N" + note.id;
      state.byId[note.id] = note;
    });
    builder.addCase(createNote.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createNote.fulfilled, (state, action) => {
      const note: INote = action.payload;
      note.id = "N" + note.id;
      state.byId[note.id] = note;
      state.byColumn[action.payload.column].push(note.id);
      state.createNoteDialogOpen = false;
      state.createLoading = false;
    });
    builder.addCase(createNote.rejected, (state) => {
      state.createLoading = false;
    });
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      for (const [column, tasks] of Object.entries(state.byColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === "N" + action.payload) {
            state.byColumn[column].splice(i, 1);
          }
        }
      }
      delete state.byId[action.payload];
    });
  },
});

export const {
  setTasksByColumn,
  setCreateDialogOpen,
  setCreateDialogColumn,
  setEditDialogOpen,
  setEditNoteDialogOpen,
  setCreateNoteDialogOpen,
  setCreateNoteDialogColumn,
  setNotesByColumn,
} = slice.actions;

/////////////////
// Update
/////////////////
export const updateItemsByColumn = (
  itemsByColumn: ItemsByColumn
): AppThunk => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const previousNotesByColumn = state.item.byColumn;
  const boardId = state.board.detail?.id;
  let notesNeedUpdate = false;
  let tasksNeedUpdate = false;

  const notesByColumn: OrderedItemsByColumn = {};
  for (const columnId in itemsByColumn) {
    for (let i = 0; i < itemsByColumn[columnId].length; i++) {
      if (itemsByColumn[columnId][i].startsWith("N")) {
        const note: OrderedItem = {
          id: itemsByColumn[columnId][i].substring(1),
          order: i,
        };

        if (notesByColumn[columnId] == null) {
          notesByColumn[columnId] = [];
        }
        notesByColumn[columnId].push(note);
      }
    }

    if (notesByColumn[columnId] && notesByColumn[columnId].length > 0) {
      notesNeedUpdate = true;
    }
  }

  const tasksByColumn: OrderedItemsByColumn = {};
  for (const columnId in itemsByColumn) {
    for (let i = 0; i < itemsByColumn[columnId].length; i++) {
      if (itemsByColumn[columnId][i].startsWith("T")) {
        const task: OrderedItem = {
          id: itemsByColumn[columnId][i].substring(1),
          order: i,
        };

        if (tasksByColumn[columnId] == null) {
          tasksByColumn[columnId] = [];
        }
        tasksByColumn[columnId].push(task);
      }
    }

    if (tasksByColumn[columnId] && tasksByColumn[columnId].length > 0) {
      tasksNeedUpdate = true;
    }
  }

  try {
    dispatch(setNotesByColumn(itemsByColumn));

    if (notesNeedUpdate) {
      await api.post(API_SORT_NOTES, {
        board: boardId,
        notes: notesByColumn,
        order: Object.values(notesByColumn).flat(),
      });
    }

    if (tasksNeedUpdate) {
      await api.post(API_SORT_TASKS, {
        board: boardId,
        tasks: tasksByColumn,
        order: Object.values(tasksByColumn).flat(),
      });
    }
  } catch (err) {
    dispatch(setNotesByColumn(previousNotesByColumn));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
