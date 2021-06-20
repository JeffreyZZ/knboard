import { ItemsByColumn } from "types";
import { DraggableLocation } from "react-beautiful-dnd";

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

interface ReorderTasksArgs {
  itemsByColumn: ItemsByColumn;
  source: DraggableLocation;
  destination: DraggableLocation;
}

export interface ReorderTasksResult {
  itemsByColumn: ItemsByColumn;
}

export const reorderTasks = ({
  itemsByColumn,
  source,
  destination,
}: ReorderTasksArgs): ReorderTasksResult => {
  const current: string[] = [...itemsByColumn[source.droppableId]];
  const next: string[] = [...itemsByColumn[destination.droppableId]];
  const target: string = current[source.index];

  // moving to same col
  if (source.droppableId === destination.droppableId) {
    const reordered: string[] = reorder(
      current,
      source.index,
      destination.index
    );
    const result: ItemsByColumn = {
      ...itemsByColumn,
      [source.droppableId]: reordered,
    };
    return {
      itemsByColumn: result,
    };
  }

  // moving to different col

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: ItemsByColumn = {
    ...itemsByColumn,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    itemsByColumn: result,
  };
};
