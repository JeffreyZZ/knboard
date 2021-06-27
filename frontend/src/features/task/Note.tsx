import React from "react";
import { WithTheme } from "@material-ui/core";
import styled from "@emotion/styled";
import { INote, ITask } from "types";
import {
  DraggableProvided,
  Draggable,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { N30, N70, Y75 } from "utils/colors";
import { noteContainerStyles } from "styles";
import { useDispatch } from "react-redux";
import { setEditNoteDialogOpen } from "./ColumnItemSlice";
import TaskLabels from "./TaskLabels";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { MD_EDITOR_PLUGINS, MD_READ_ONLY_CONFIG } from "const";

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
  if (isDragging) {
    return "#eee";
  }

  if (isGroupedOver) {
    return N30;
  }

  return Y75;
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

const mdParser = new MarkdownIt({ breaks: true });

// The following link provides a good reference on how to configure mdEditor.
// https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/editor/index.less
const EditorWrapper = styled.div<WithTheme & { editing: boolean }>`
  font-weight: normal;
  font-size: 8px;

  .rc-md-editor {
    background-color: transparent;
    border: none;
    display: flex;
    .section-container {
      padding: 0;
      width: 100%;
      font-size: 8px;
    }
    .sec-html {
      .html-wrap {
        padding: 0;
        font-size: 8px;
      }
    }
    .custom-html-style {
      p {
        /*Note line height and font size*/
        font-size: 13px;
        line-height: 1.5;
        margin: 8px 0;
      }
    }
  }
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
          css={noteContainerStyles}
        >
          <Content>
            <EditorWrapper editing={false}>
              <MdEditor
                plugins={MD_EDITOR_PLUGINS}
                config={MD_READ_ONLY_CONFIG}
                value={note.description}
                renderHTML={(text) => mdParser.render(text)}
              />
            </EditorWrapper>
            <TaskId>id: {note.id}</TaskId>
            <TaskLabels task={note as ITask} />
          </Content>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo<Props>(Note);
