import { NotesByColumn, Id } from "types";
import { DraggableLocation } from "react-beautiful-dnd";
import reorder from "utils/reorder";

interface ReorderNotesArgs {
  notesByColumn: NotesByColumn;
  source: DraggableLocation;
  destination: DraggableLocation;
}

export interface ReorderNotesResult {
  notesByColumn: NotesByColumn;
}

export const reorderNotes = ({
  notesByColumn,
  source,
  destination,
}: ReorderNotesArgs): ReorderNotesResult => {
  const current: Id[] = [...notesByColumn[source.droppableId]];
  const next: Id[] = [...notesByColumn[destination.droppableId]];
  const target: Id = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Id[] = reorder(current, source.index, destination.index);
    const result: NotesByColumn = {
      ...notesByColumn,
      [source.droppableId]: reordered,
    };
    return {
      notesByColumn: result,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: NotesByColumn = {
    ...notesByColumn,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    notesByColumn: result,
  };
};
