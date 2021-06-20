import React from "react";
import styled from "@emotion/styled";
import { R50, T50, COLUMN_COLOR } from "utils/colors";
import { grid, barHeight, taskWidth } from "const";
import { IColumnItem, ITask, INote } from "types";
import {
  DroppableProvided,
  DroppableStateSnapshot,
  Droppable,
} from "react-beautiful-dnd";
import Task from "./Task";
import Note from "./Note";
import AddTask from "./AddTask";
import { css } from "@emotion/core";
import { count } from "console";

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return R50;
  }
  if (isDraggingFrom) {
    return T50;
  }
  return COLUMN_COLOR;
};

const Wrapper = styled.div<{
  isDraggingOver: boolean;
  isDraggingFrom: boolean;
}>`
  background-color: ${(props) =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: ${taskWidth}px;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const Container = styled.div``;

interface Props {
  columnId: number;
  listType: string;
  items: IColumnItem[];
  index: number;
}

interface TaskListProps {
  items: IColumnItem[];
}

const InnerTaskList = ({ items }: TaskListProps) => {
  const sections = [];

  for (let counter = 0; counter < items.length; counter++) {
    if (items[counter].id.startsWith("T")) {
      const task = items[counter] as ITask;
      sections.push(<Task key={task.id} task={task} index={counter} />);
    } else {
      const note = items[counter] as INote;
      sections.push(<Note key={note.id} note={note} index={counter} />);
    }
  }

  return <>{sections}</>;
};

interface InnerListProps {
  dropProvided: DroppableProvided;
  columnId: number;
  items: IColumnItem[];
  index: number;
}

const InnerList = ({
  columnId,
  items,
  dropProvided,
  index,
}: InnerListProps) => (
  <Container>
    <DropZone
      data-testid="drop-zone"
      ref={dropProvided.innerRef}
      css={css`
        max-height: calc(100vh - ${barHeight * 5}px);
        overflow-y: scroll;
      `}
    >
      <InnerTaskList items={items} />
      {dropProvided.placeholder}
    </DropZone>
    <AddTask columnId={columnId} index={index} />
  </Container>
);

const TaskList = ({ columnId, listType, items: items, index }: Props) => (
  <Droppable droppableId={columnId.toString()} type={listType}>
    {(
      dropProvided: DroppableProvided,
      dropSnapshot: DroppableStateSnapshot
    ) => (
      <Wrapper
        isDraggingOver={dropSnapshot.isDraggingOver}
        isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
        {...dropProvided.droppableProps}
      >
        <InnerList
          columnId={columnId}
          items={items}
          dropProvided={dropProvided}
          index={index}
        />
      </Wrapper>
    )}
  </Droppable>
);

export default TaskList;
