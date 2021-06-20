import React, { useEffect, useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import { setCreateNoteDialogOpen, createNote } from "./ColumnItemSlice";
import { PRIMARY } from "utils/colors";
import { MD_EDITOR_PLUGINS, MD_EDITOR_CONFIG, Key } from "const";
import { Label } from "types";
import { createMdEditorStyles } from "styles";
import { selectAllLabels } from "features/label/LabelSlice";
import getMetaKey from "utils/shortcuts";
import LabelChip from "components/LabelChip";

const mdParser = new MarkdownIt();

const DialogTitle = styled.h3`
  color: ${PRIMARY};
  margin-top: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const EditorWrapper = styled.div`
  margin: 1rem 0;
  ${createMdEditorStyles(false)}
  .rc-md-editor {
    min-height: 160px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ccc;
  padding: 1rem 2rem;
`;

const CreateNoteDialog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const labelsOptions = useSelector(selectAllLabels);
  const open = useSelector(
    (state: RootState) => state.item.createNoteDialogOpen
  );
  const columnId = useSelector(
    (state: RootState) => state.item.createNoteDialogColumn
  );
  const createLoading = useSelector(
    (state: RootState) => state.item.createLoading
  );
  const [description, setDescription] = useState<string>("");
  const [labels, setLabels] = useState<Label[]>([]);
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  const setInitialValues = () => {
    if (columnId) {
      setDescription("");
      setLabels([]);
    }
  };

  useEffect(() => {
    setInitialValues();
  }, [open]);

  const handleClose = () => {
    if (window.confirm("Are you sure? Any progress made will be lost.")) {
      dispatch(setCreateNoteDialogOpen(false));
    }
  };

  const handleCreate = async () => {
    if (columnId) {
      const newNote = {
        description,
        column: columnId,
        labels: labels.map((l) => l.id),
      };
      dispatch(createNote(newNote));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode == Key.Enter && e.metaKey) {
      handleCreate();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      keepMounted={false}
      fullScreen={xsDown}
    >
      <Content onKeyDown={handleKeyDown}>
        <DialogTitle>New Note</DialogTitle>

        <EditorWrapper>
          <MdEditor
            plugins={MD_EDITOR_PLUGINS}
            config={MD_EDITOR_CONFIG}
            value={description}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            placeholder="Describe the issue..."
          />
        </EditorWrapper>

        <Autocomplete
          multiple
          id="create-labels-select"
          size="small"
          filterSelectedOptions
          autoHighlight
          openOnFocus
          options={labelsOptions}
          getOptionLabel={(option) => option.name}
          value={labels}
          onChange={(_, newLabels) => setLabels(newLabels)}
          renderInput={(params) => (
            <TextField {...params} label="Labels" variant="outlined" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <LabelChip
                key={option.id}
                label={option}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(option) => <LabelChip label={option} size="small" />}
          css={css`
            margin-top: 1rem;
            width: 100%;
          `}
        />
      </Content>

      <Footer theme={theme}>
        <Button
          startIcon={
            createLoading ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              <FontAwesomeIcon icon={faRocket} />
            )
          }
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreate}
          disabled={createLoading}
          data-testid="task-create"
          css={css`
            ${theme.breakpoints.down("xs")} {
              flex-grow: 1;
            }
          `}
        >
          Create note ({getMetaKey()}+⏎)
        </Button>
        <Button
          css={css`
            margin-left: 1rem;
          `}
          onClick={handleClose}
        >
          Cancel (Esc)
        </Button>
      </Footer>
    </Dialog>
  );
};

export default CreateNoteDialog;
