import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  WithTheme,
} from "@material-ui/core";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditNoteDialogOpen,
  deleteNote,
  attachImage,
  deleteImage,
  updateItemsByColumn,
  patchNote,
} from "./ColumnItemSlice";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faAlignLeft,
  faFileUpload,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import { createInfoToast } from "features/toast/ToastSlice";
import { PRIMARY, TASK_G } from "utils/colors";
import { IColumn, ItemsByColumn, Label, INote } from "types";
import {
  selectAllColumns,
  selectColumnsEntities,
} from "features/column/ColumnSlice";
import { Autocomplete } from "@material-ui/lab";
import { createMdEditorStyles, descriptionStyles } from "styles";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import {
  MD_EDITOR_CONFIG,
  MD_EDITOR_PLUGINS,
  MD_READ_ONLY_CONFIG,
  Key,
  taskDialogHeight,
  taskSideWidth,
} from "const";
import Close from "components/Close";
import {
  selectAllLabels,
  selectLabelEntities,
} from "features/label/LabelSlice";
import { formatDistanceToNow } from "date-fns";
import getMetaKey from "utils/shortcuts";
import LabelChip from "components/LabelChip";
import AttachmentAddPopup from "./AttachmentAddPopup";
import Attachments from "./Attachments/Attachments";
import { useTranslation } from "react-i18next";

const mdParser = new MarkdownIt({ breaks: true });

const Content = styled.div<WithTheme>`
  display: flex;
  padding: 2rem;
  height: ${taskDialogHeight}px;
  ${(props) => props.theme.breakpoints.down("xs")} {
    flex-direction: column;
  }
`;

const Main = styled.div`
  width: 100%;
`;

const Side = styled.div<WithTheme>`
  margin-top: 2rem;
  ${(props) => props.theme.breakpoints.up("sm")} {
    max-width: ${taskSideWidth}px;
    min-width: ${taskSideWidth}px;
  }
`;

const Header = styled.div`
  color: ${TASK_G};
  height: 2rem;
  h3 {
    margin: 0 0.25rem 0 0;
  }
`;

const EditorWrapper = styled.div<WithTheme & { editing: boolean }>`
  margin: 1rem 0;
  margin-right: 2rem;
  ${(props) => createMdEditorStyles(props.editing)};

  .rc-md-editor {
    min-height: ${(props) => (props.editing ? 180 : 32)}px;
    border: none;
    .section-container {
      ${(props) =>
        props.editing &&
        `
        outline: none;
        box-shadow: inset 0 0 0 2px ${PRIMARY};
      `};
      padding: ${(props) => (props.editing ? "8px" : "0px")} !important;
      &.input {
        line-height: 20px;
      }
    }
  }
`;

const DescriptionHeader = styled.div`
  display: flex;
  align-items: center;
  h3 {
    margin: 0 0 0 12px;
  }
`;

const Description = styled.div`
  ${descriptionStyles}
`;

const DescriptionActions = styled.div`
  display: flex;
`;

const AttachmentsHeader = styled.div`
  display: flex;
  align-items: center;
  h3 {
    margin: 0 0 0 12px;
  }
`;

const Text = styled.p`
  color: #626e83;
  margin: 4px 0;
  font-size: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const EditNoteDialog = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const columns = useSelector(selectAllColumns);
  const labels = useSelector(selectAllLabels);
  const labelsById = useSelector(selectLabelEntities);
  const columnsById = useSelector(selectColumnsEntities);
  const itemsByColumn = useSelector((state: RootState) => state.item.byColumn);
  const noteId = useSelector(
    (state: RootState) => state.item.editNoteDialogOpen
  );
  const itemsById = useSelector((state: RootState) => state.item.byId);
  const [description, setDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MdEditor>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const open = noteId !== null;

  const DESCRIPTION_PLACEHOLDER = t("message.writeHere"); // "Write here...";

  useEffect(() => {
    if (noteId && itemsById[noteId]) {
      setDescription((itemsById[noteId] as INote).description);
    }
  }, [open, noteId]);

  const handleSaveDescription = () => {
    if (noteId) {
      const id = Number(noteId.substring(1));
      dispatch(patchNote({ id: id, fields: { description } }));
      setEditingDescription(false);
    }
  };

  const handleCancelDescription = () => {
    if (noteId && itemsById[noteId]) {
      setDescription((itemsById[noteId] as INote).description);
      setEditingDescription(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        cancelRef.current &&
        !cancelRef.current?.contains(event.target)
      ) {
        handleSaveDescription();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, noteId, description]);

  useEffect(() => {
    if (editingDescription && editorRef && editorRef.current) {
      editorRef.current.setSelection({
        start: 0,
        end: description.length,
      });
    }
  }, [editingDescription]);

  const findTaskColumnId = () => {
    for (const columnId in itemsByColumn) {
      for (const id of itemsByColumn[columnId]) {
        if (id === noteId) {
          return columnId;
        }
      }
    }
    return null;
  };

  const columnId = findTaskColumnId();

  if (!noteId || !itemsById[noteId] || !columnId) {
    return null;
  }

  const note = itemsById[noteId] as INote;
  const column = columnsById[columnId];

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode == Key.Enter && e.metaKey) {
      handleSaveDescription();
    }
    if (e.keyCode === Key.Escape) {
      // Prevent propagation from reaching the Dialog
      e.stopPropagation();
      handleCancelDescription();
    }
  };

  const handleClose = () => {
    dispatch(setEditNoteDialogOpen(null));
    setEditingDescription(false);
  };

  const handleColumnChange = (_: any, value: IColumn | null) => {
    if (!column || !value || column.id === value.id) {
      return;
    }
    const current: string[] = [...itemsByColumn[column.id]];
    const next: string[] = [...itemsByColumn[value.id]];

    const currentId = current.indexOf(note.id);
    const newPosition = 0;

    // remove from original
    current.splice(currentId, 1);
    // insert into next
    next.splice(newPosition, 0, note.id);

    const updatedNotesByColumn: ItemsByColumn = {
      ...itemsByColumn,
      [column.id]: current,
      [value.id]: next,
    };
    dispatch(updateItemsByColumn(updatedNotesByColumn));
    handleClose();
  };

  const onAttachmentCreate = ({ file }) => {
    const newFile = {
      title: file.name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      item_id: note.id.slice(1),
      content: file,
    };
    dispatch(attachImage(newFile));
  };

  const onAttachmentDelete = (coverId: number) => {
    if (
      window.confirm("Are you sure? Deleting an attachement cannot be undone.")
    ) {
      dispatch(deleteImage({ imageId: coverId, itemId: note.id }));
    }
  };

  const handleCoverUpdate = (coverId: number) => {
    if (noteId) {
      const id = Number(noteId.substring(1));
      dispatch(patchNote({ id: id, fields: { coverid: coverId } }));
    }
  };

  const handleNotImplemented = () => {
    dispatch(createInfoToast("Not implemented yet 😟"));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure? Deleting a task cannot be undone.")) {
      const id = Number(note.id.substring(1));
      dispatch(deleteNote(id));
      handleClose();
    }
  };

  const handleDescriptionClick = () => {
    setEditingDescription(true);
  };

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  const handleLabelsChange = (newLabels: Label[]) => {
    const id = Number(noteId.substring(1));
    dispatch(
      patchNote({
        id: id,
        fields: { labels: newLabels.map((label) => label.id) },
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // don't listen for input when inputs are focused
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === "Backspace" && e.metaKey) {
      handleDelete();
    }

    if (e.key === "Escape" && e.metaKey) {
      handleClose();
    }

    if (e.key === "l" && e.metaKey) {
      e.preventDefault();
      handleNotImplemented();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      fullWidth
      keepMounted={false}
      fullScreen={xsDown}
      css={css`
        .MuiDialog-paper {
          max-width: 920px;
        }
      `}
    >
      <Content theme={theme}>
        <Close onClose={handleClose} />
        <Main>
          <Header>id: {note.id}</Header>
          <DescriptionHeader>
            <FontAwesomeIcon icon={faAlignLeft} />
            <h3>{t("common.description")}</h3>
          </DescriptionHeader>
          <Description
            key={`${noteId}${editingDescription}`}
            data-testid="task-description"
          >
            <EditorWrapper
              onDoubleClick={
                editingDescription ? undefined : handleDescriptionClick
              }
              editing={editingDescription}
              ref={wrapperRef}
              theme={theme}
              onKeyDown={handleEditorKeyDown}
            >
              <MdEditor
                ref={editorRef}
                plugins={MD_EDITOR_PLUGINS}
                config={
                  editingDescription ? MD_EDITOR_CONFIG : MD_READ_ONLY_CONFIG
                }
                value={
                  editingDescription
                    ? description
                    : description || DESCRIPTION_PLACEHOLDER
                }
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                placeholder={DESCRIPTION_PLACEHOLDER}
              />
            </EditorWrapper>
            {editingDescription && (
              <DescriptionActions>
                <Button
                  variant="contained"
                  data-testid="save-description"
                  onClick={handleSaveDescription}
                  color="primary"
                  size="small"
                >
                  Save ({getMetaKey()}+⏎)
                </Button>
                <Button
                  variant="outlined"
                  data-testid="cancel-description"
                  onClick={handleCancelDescription}
                  ref={cancelRef}
                  size="small"
                  css={css`
                    margin-left: 0.5rem;
                  `}
                >
                  Cancel (Esc)
                </Button>
              </DescriptionActions>
            )}
          </Description>
          <AttachmentsHeader>
            <FontAwesomeIcon icon={faImages} />
            <h3>{t("common.attachments")}</h3>
          </AttachmentsHeader>
          <Attachments
            images={note.images}
            itemId={note.id.slice(1)}
            coverId={note.coverid}
            onDelete={onAttachmentDelete}
            onCoverUpdate={handleCoverUpdate}
          />
        </Main>
        <Side theme={theme}>
          <Autocomplete
            id="column-select"
            size="small"
            options={columns}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Column" variant="outlined" />
            )}
            value={column}
            onChange={handleColumnChange}
            disableClearable
            openOnFocus
            data-testid="edit-column"
            css={css`
              width: 100%;
            `}
          />
          <Autocomplete
            multiple
            id="labels-select"
            data-testid="edit-labels"
            size="small"
            filterSelectedOptions
            autoHighlight
            openOnFocus
            blurOnSelect
            disableClearable
            options={labels}
            getOptionLabel={(option) => option.name}
            value={
              (itemsById[noteId] as INote).labels.map(
                (labelId) => labelsById[labelId]
              ) as Label[]
            }
            onChange={(_, newLabels) => handleLabelsChange(newLabels)}
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
              width: 100%;
              margin-top: 1rem;
              margin-bottom: 2rem;
            `}
          />
          <ButtonsContainer>
            <Button
              startIcon={<FontAwesomeIcon fixedWidth icon={faTrash} />}
              onClick={handleDelete}
              data-testid="delete-task"
              size="small"
              css={css`
                font-size: 12px;
                font-weight: bold;
                color: ${TASK_G};
              `}
            >
              Delete note ({getMetaKey()}+⌫)
            </Button>
            <AttachmentAddPopup onCreate={onAttachmentCreate}>
              <Button
                startIcon={<FontAwesomeIcon fixedWidth icon={faFileUpload} />}
                size="small"
                css={css`
                  font-size: 12px;
                  font-weight: bold;
                  color: ${TASK_G};
                `}
              >
                Attach picture
              </Button>
            </AttachmentAddPopup>
          </ButtonsContainer>
          <Text>
            Updated {formatDistanceToNow(new Date(note.modified))} ago
          </Text>
          <Text
            css={css`
              margin-bottom: 1rem;
            `}
          >
            Created {formatDistanceToNow(new Date(note.created))} ago
          </Text>
        </Side>
      </Content>
    </Dialog>
  );
};

export default EditNoteDialog;
