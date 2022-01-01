import { dequal } from "dequal";
import React, { useCallback, useEffect, useRef } from "react";
import { Button, Form } from "semantic-ui-react";
import withPopup from "../../../components/Popup/with-popup";
import Input from "../../../components/Input/Input";
import Popup from "../../../components/Popup/Popup";

import { useForm, useSteps } from "../../../utils/hooks";
import DeleteStep from "../../../components/DeleteStep/DeleteStep";

import styles from "./EditPopup.module.scss";

const StepTypes = {
  DELETE: "DELETE",
};

interface Props {
  defaultData: any;
  onUpdate: any;
  onDelete: any;
  onClose: any;
}

// eslint-disable-next-line react/display-name
const EditStep = React.memo(
  ({ defaultData, onUpdate, onDelete, onClose }: Props) => {
    const [data, handleFieldChange] = useForm(() => ({
      name: "",
      ...defaultData,
    }));

    const [step, openStep, handleBack] = useSteps();

    const nameField = useRef(null);

    const handleSubmit = useCallback(() => {
      const cleanData = {
        ...data,
        name: data.name.trim(),
      };

      if (!cleanData.name) {
        nameField.current.select();
        return;
      }

      if (!dequal(cleanData, defaultData)) {
        onUpdate(cleanData);
      }

      onClose();
    }, [defaultData, onUpdate, onClose, data]);

    const handleDeleteClick = useCallback(() => {
      openStep(StepTypes.DELETE, null);
    }, [openStep]);

    useEffect(() => {
      nameField.current.select();
    }, []);

    if (step && step.type === StepTypes.DELETE) {
      return (
        <DeleteStep
          title={"deleteAttachment"}
          content={"areYouSureYouWantToDeleteThisAttachment"}
          buttonContent={"deleteAttachment"}
          onConfirm={onDelete}
          onBack={handleBack}
        />
      );
    }

    return (
      <>
        <Popup.Header>{"editAttachment"}</Popup.Header>
        <Popup.Content>
          <Form onSubmit={handleSubmit}>
            <div className={styles.text}>{"title"}</div>
            <Input
              fluid
              ref={nameField}
              name="name"
              value={data.name}
              className={styles.field}
              onChange={handleFieldChange}
            />
            <Button positive content={"save"} />
          </Form>
          <Button
            content={"delete"}
            className={styles.deleteButton}
            onClick={handleDeleteClick}
          />
        </Popup.Content>
      </>
    );
  }
);

export default withPopup(EditStep);
