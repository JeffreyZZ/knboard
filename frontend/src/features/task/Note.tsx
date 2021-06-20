import React from "react";
import styled from "@emotion/styled";
import { INote, ITask } from "types";
import {
  DraggableProvided,
  Draggable,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { N30, N70, PRIMARY, Y50 } from "utils/colors";
import { taskContainerStyles } from "styles";
import { useDispatch } from "react-redux";
import { setEditNoteDialogOpen } from "./ColumnItemSlice";
import TaskLabels from "./TaskLabels";

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
  if (isDragging) {
    return "#eee";
  }

  if (isGroupedOver) {
    return N30;
  }

  return Y50;
};

const getBorderColor = (isDragging: boolean) =>
  isDragging ? "orange" : "transparent";

interface ContainerProps {
  isDragging: boolean;
  isGroupedOver: boolean;
}

const Container = styled.span<ContainerProps>`
  border-color: ${(props) => getBorderColor(props.isDragging)};
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${N70}` : "none"};

  &:focus {
    border-color: #aaa;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TextContent = styled.div`
  position: relative;
  padding-right: 14px;
  word-break: break-word;
  color: ${PRIMARY};
  font-weight: bold;
  font-size: 12px;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: left;
  font-weight: bold;
  color: #aaa;
  font-size: 8px;
`;

const getStyle = (provided: DraggableProvided, style?: Record<string, any>) => {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
};

interface Props {
  note: INote;
  style?: Record<string, any>;
  index: number;
}

const Note = ({ note: note, style, index }: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setEditNoteDialogOpen(note.id));
  };

  return (
    <Draggable key={note.id} draggableId={`note-${note.id}`} index={index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <Container
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={getStyle(dragProvided, style)}
          data-is-dragging={dragSnapshot.isDragging}
          data-testid={`note-${note.id}`}
          data-index={index}
          aria-label={`note ${note.description}`}
          onClick={handleClick}
          css={taskContainerStyles}
        >
          <Content>
            <TextContent>{note.description}</TextContent>
            <TaskId>id: {note.id}</TaskId>
            <TaskLabels task={note as ITask} />
          </Content>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo<Props>(Note);
