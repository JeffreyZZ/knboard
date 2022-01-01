import React from "react";
import { Button } from "semantic-ui-react";
import Popup from "../Popup/Popup";

import styles from "./DeleteStep.module.scss";

interface Props {
  title: string;
  content: string;
  buttonContent: string;
  onConfirm: any;
  onBack: any;
}

// eslint-disable-next-line react/display-name
const DeleteStep = React.memo(
  ({ title, content, buttonContent, onConfirm, onBack }: Props) => (
    <>
      <Popup.Header onBack={onBack}>{title}</Popup.Header>
      <Popup.Content>
        <div className={styles.content}>{content}</div>
        <Button fluid negative content={buttonContent} onClick={onConfirm} />
      </Popup.Content>
    </>
  )
);

export default DeleteStep;
