import React from "react";
import styled from "@emotion/styled";
import { IQuestion, BoardMember } from "types";
import {
  DraggableProvided,
  Draggable,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { N30, N0, N70, PRIMARY } from "utils/colors";
import { PRIO_COLORS } from "const";
import { taskContainerStyles } from "styles";
import { AvatarGroup } from "@material-ui/lab";
import { css } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@material-ui/core";
import { setEditQuestionDialogOpen } from "./ColumnItemSlice";
import QuestionLabels from "./QuestionLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { selectMembersEntities } from "features/member/MemberSlice";

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
  if (isDragging) {
    return "#eee";
  }

  if (isGroupedOver) {
    return N30;
  }

  return N0;
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

const Footer = styled.div`
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardIcon = styled.div`
  display: flex;
  font-size: 0.75rem;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuestionId = styled.small`
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

const Assignees = styled.div``;

const getStyle = (provided: DraggableProvided, style?: Record<string, any>) => {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
};

export const QuestionFooter = ({ question }: { question: IQuestion }) => {
  const membersByIds = useSelector(selectMembersEntities);
  const assignees = question.assignees.map(
    (assigneeId) => membersByIds[assigneeId]
  ) as BoardMember[];

  return (
    <Footer>
      <CardIcon data-testid="task-priority">
        <FontAwesomeIcon
          icon={faArrowUp}
          color={PRIO_COLORS[question.priority]}
        />
      </CardIcon>
      {assignees.length > 0 && (
        <Assignees>
          <AvatarGroup
            max={3}
            css={css`
              & .MuiAvatarGroup-avatar {
                height: 1.25rem;
                width: 1.25rem;
                font-size: 8px;
                margin-left: -4px;
                border: none;
              }
            `}
          >
            {assignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                css={css`
                  height: 1.25rem;
                  width: 1.25rem;
                  font-size: 8px;
                  margin-left: -12px;
                `}
                src={assignee.avatar?.photo}
                alt={assignee.avatar?.name}
              >
                {assignee.username.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </Assignees>
      )}
    </Footer>
  );
};

interface Props {
  question: IQuestion;
  style?: Record<string, any>;
  index: number;
}

const Question = ({ question: question, style, index }: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setEditQuestionDialogOpen(question.id));
  };

  return (
    <Draggable
      key={question.id}
      draggableId={`question-${question.id}`}
      index={index}
    >
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
          data-testid={`question-${question.id}`}
          data-index={index}
          aria-label={`question ${question.title}`}
          onClick={handleClick}
          css={taskContainerStyles}
        >
          <Content>
            <TextContent>{question.title}</TextContent>
            <QuestionId>id: {question.id}</QuestionId>
            <QuestionLabels question={question} />
            <QuestionFooter question={question} />
          </Content>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo<Props>(Question);
