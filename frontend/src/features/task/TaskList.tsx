import React from "react";
import styled from "@emotion/styled";
import { R50, T50, COLUMN_COLOR } from "utils/colors";
import { grid, barHeight, taskWidth } from "const";
import { ITask, INote } from "types";
import {
  DroppableProvided,
  DroppableStateSnapshot,
  Droppable,
} from "react-beautiful-dnd";
import Task from "./Task";
import Note from "./Note";
import AddTask from "./AddTask";
import { css } from "@emotion/core";

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
  tasks: ITask[];
  notes: INote[];
  index: number;
}

interface TaskListProps {
  tasks: ITask[];
  notes: INote[];
}

const InnerTaskList = ({ tasks, notes }: TaskListProps) => {
  const sections = [];
  let taskIndex = 0;
  let noteIndex = 0;
  let indexInCol = 0;

  while (taskIndex < tasks.length && noteIndex < notes.length) {
    if (tasks[taskIndex].task_order <= notes[noteIndex].task_order) {
      sections.push(
        <Task
          key={tasks[taskIndex].id}
          task={tasks[taskIndex]}
          index={indexInCol++}
        />
      );
      taskIndex++;
    } else {
      sections.push(
        <Note
          key={notes[noteIndex].id}
          note={notes[noteIndex]}
          index={indexInCol++}
        />
      );
      noteIndex++;
    }
  }

  while (taskIndex < tasks.length) {
    sections.push(
      <Task
        key={tasks[taskIndex].id}
        task={tasks[taskIndex]}
        index={indexInCol++}
      />
    );
    taskIndex++;
  }

  while (noteIndex < notes.length) {
    sections.push(
      <Note
        key={notes[noteIndex].id}
        note={notes[noteIndex]}
        index={indexInCol++}
      />
    );
    noteIndex++;
  }
  return <>{sections}</>;
};

interface InnerListProps {
  dropProvided: DroppableProvided;
  columnId: number;
  tasks: ITask[];
  notes: INote[];
  index: number;
}

const InnerList = ({
  columnId,
  tasks,
  notes,
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
      <InnerTaskList tasks={tasks} notes={notes} />
      {dropProvided.placeholder}
    </DropZone>
    <AddTask columnId={columnId} index={index} />
  </Container>
);

const TaskList = ({
  columnId,
  listType,
  tasks: tasks,
  notes: notes,
  index,
}: Props) => (
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
          tasks={tasks}
          notes={notes}
          dropProvided={dropProvided}
          index={index}
        />
      </Wrapper>
    )}
  </Droppable>
);

export default TaskList;
