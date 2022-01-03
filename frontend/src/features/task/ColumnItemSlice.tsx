import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  OrderedItemsByColumn,
  OrderedItem,
  ItemsByColumn,
  IColumnItem,
  ITask,
  INote,
  IQuestion,
  IAttachImage,
  Id,
  NewTask,
  NewNote,
  NewQuestion,
  IUploadFile,
  PriorityValue,
} from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import {
  createErrorToast,
  createSuccessToast,
  createInfoToast,
} from "features/toast/ToastSlice";
import api, {
  API_SORT_TASKS,
  API_TASKS,
  API_SORT_NOTES,
  API_NOTES,
  API_SORT_QUESTIONS,
  API_QUESTIONS,
  API_IMAGES,
} from "api";
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
  createQuestionDialogOpen: boolean;
  createQuestionDialogColumn: Id | null;
  editQuestionDialogOpen: string | null;
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
  createQuestionDialogOpen: false,
  createQuestionDialogColumn: null,
  editQuestionDialogOpen: null,
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
  coverid: number;
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

interface PatchQuestionFields {
  title: string;
  description: string;
  priority: PriorityValue;
  labels: Id[];
  assignees: Id[];
}

export const patchQuestion = createAsyncThunk<
  IQuestion,
  { id: Id; fields: Partial<PatchQuestionFields> }
>("question/patchQuestionStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_QUESTIONS}${id}/`, fields);
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

interface CreateQuestionResponse extends IQuestion {
  column: Id;
}

export const createQuestion = createAsyncThunk<
  CreateQuestionResponse,
  NewQuestion,
  {
    rejectValue: string;
  }
>(
  "question/createQuestionStatus",
  async (question, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`${API_QUESTIONS}`, question);
      dispatch(createSuccessToast("Question created"));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/////////////////
// Attach
/////////////////
interface AttachImageResponse extends IAttachImage {
  column: Id;
}

export const attachImage = createAsyncThunk<
  AttachImageResponse,
  IUploadFile,
  {
    rejectValue: string;
  }
>("image/attachStatus", async (image, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("title", image.title);
    formData.append("image", image.content);
    formData.append("note", image.item_id);
    const response = await api.post(`${API_IMAGES}`, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    dispatch(createSuccessToast("Image attached"));
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

export const deleteQuestion = createAsyncThunk<Id, Id>(
  "question/deleteQuestionStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_QUESTIONS}${id}/`);
    dispatch(createInfoToast("Question deleted"));
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
    setCreateQuestionDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createQuestionDialogOpen = action.payload;
    },
    setCreateQuestionDialogColumn: (state, action: PayloadAction<Id>) => {
      state.createQuestionDialogColumn = action.payload;
    },
    setEditQuestionDialogOpen: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.editQuestionDialogOpen = action.payload;
    },
    setQuestionsByColumn: (state, action: PayloadAction<ItemsByColumn>) => {
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
        for (const question of col.questions) {
          question.id = "Q" + question.id;
          byId[question.id] = question;
        }

        // byColumn
        if (!byColumn[col.id]) {
          byColumn[col.id] = [];
        }
        sortedItemInColumn = [];
        col.tasks.map((t) => sortedItemInColumn.push(t as IColumnItem));
        col.notes.map((n) => sortedItemInColumn.push(n as IColumnItem));
        col.questions.map((q) => sortedItemInColumn.push(q as IColumnItem));
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
    builder.addCase(patchQuestion.fulfilled, (state, action) => {
      const question: IQuestion = action.payload;
      question.id = "Q" + question.id;
      state.byId[question.id] = question;
    });
    builder.addCase(createQuestion.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createQuestion.fulfilled, (state, action) => {
      const question: IQuestion = action.payload;
      question.id = "Q" + question.id;
      state.byId[question.id] = question;
      state.byColumn[action.payload.column].push(question.id);
      state.createQuestionDialogOpen = false;
      state.createLoading = false;
    });
    builder.addCase(createQuestion.rejected, (state) => {
      state.createLoading = false;
    });
    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      for (const [column, questions] of Object.entries(state.byColumn)) {
        for (let i = 0; i < questions.length; i++) {
          if (questions[i] === "Q" + action.payload) {
            state.byColumn[column].splice(i, 1);
          }
        }
      }
      delete state.byId[action.payload];
    });
    builder.addCase(attachImage.fulfilled, (state, action) => {
      // add the new attached image into the note's images (state) to trigger the componenet re-render
      const image: IAttachImage = action.payload;
      (state.byId["N" + image.note] as INote).images.push(image);
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
  setEditQuestionDialogOpen,
  setCreateQuestionDialogOpen,
  setCreateQuestionDialogColumn,
  setQuestionsByColumn,
} = slice.actions;

/////////////////
// Update
/////////////////
export const updateItemsByColumn = (
  itemsByColumn: ItemsByColumn
): AppThunk => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const previousItemsByColumn = state.item.byColumn;
  const boardId = state.board.detail?.id;
  let notesNeedUpdate = false;
  let tasksNeedUpdate = false;
  let questionsNeedUpdate = false;

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

  const questionsByColumn: OrderedItemsByColumn = {};
  for (const columnId in itemsByColumn) {
    for (let i = 0; i < itemsByColumn[columnId].length; i++) {
      if (itemsByColumn[columnId][i].startsWith("Q")) {
        const task: OrderedItem = {
          id: itemsByColumn[columnId][i].substring(1),
          order: i,
        };

        if (questionsByColumn[columnId] == null) {
          questionsByColumn[columnId] = [];
        }
        questionsByColumn[columnId].push(task);
      }
    }

    if (questionsByColumn[columnId] && questionsByColumn[columnId].length > 0) {
      questionsNeedUpdate = true;
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

    if (questionsNeedUpdate) {
      await api.post(API_SORT_QUESTIONS, {
        board: boardId,
        questions: questionsByColumn,
        order: Object.values(questionsByColumn).flat(),
      });
    }
  } catch (err) {
    dispatch(setNotesByColumn(previousItemsByColumn));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
