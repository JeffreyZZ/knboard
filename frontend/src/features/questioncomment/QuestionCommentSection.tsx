import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, CircularProgress } from "@material-ui/core";
import MemberAvatar from "components/MemberAvatar";
import { selectMe } from "features/auth/AuthSlice";
import CommentTextarea from "features/questioncomment/QuestionCommentTextarea";
import { selectMembersEntities } from "features/member/MemberSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionCommentItem from "./QuestionCommentItem";
import {
  createComment,
  fetchComments,
  selectAllComments,
  selectCreateCommentStatus,
  selectFetchCommentsStatus,
} from "./QuestionCommentSlice";

interface Props {
  questionId: number;
}

const QuestionCommentSection = ({ questionId }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectMe);
  const comments = useSelector(selectAllComments);
  const memberEntities = useSelector(selectMembersEntities);
  const fetchStatus = useSelector(selectFetchCommentsStatus);
  const createStatus = useSelector(selectCreateCommentStatus);
  const [content, setText] = useState("");

  useEffect(() => {
    dispatch(fetchComments(questionId));
  }, [dispatch, questionId]);

  const postComment = () => {
    setText("");
    // eslint-disable-next-line @typescript-eslint/camelcase
    dispatch(createComment({ content, commentable_id: questionId }));
  };

  const currentQuestionComments = comments.filter(
    (comment) => comment.commentable_id === questionId
  );

  return (
    <>
      <Header>
        <FontAwesomeIcon icon={faComments} />
        <Title>Discussion</Title>
      </Header>

      <Box display="flex" mb={4}>
        <MemberAvatar member={memberEntities[user?.id ?? -1]} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          marginLeft={2}
          marginRight={2}
        >
          <CommentTextarea
            onChange={(e) => setText(e.target.value)}
            value={content}
          />
          <Box>
            <Button
              color="primary"
              variant="contained"
              size="small"
              startIcon={
                createStatus === "loading" ? (
                  <CircularProgress color="inherit" size={16} />
                ) : undefined
              }
              disabled={!content.length || createStatus === "loading"}
              css={css`
                text-transform: none;
              `}
              onClick={postComment}
            >
              Post comment
            </Button>
          </Box>
        </Box>
      </Box>

      {!currentQuestionComments.length && fetchStatus === "loading" && (
        <CircularProgress />
      )}
      {currentQuestionComments.map((comment) => (
        <QuestionCommentItem key={comment.id} comment={comment} />
      ))}
    </>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const Title = styled.h3`
  margin: 0 0 0 12px;
`;

export default QuestionCommentSection;
