import React from "react";
import {
  Button,
  PopupHeaderProps,
  Popup as SemanticUIPopup,
} from "semantic-ui-react";

import styles from "./PopupHeader.module.css";

interface Props extends PopupHeaderProps {
  children?: any;
  onBack?: any;
}

// eslint-disable-next-line react/display-name
const PopupHeader = React.memo(({ children, onBack }: Props) => (
  <SemanticUIPopup.Header className={styles.wrapper}>
    {onBack && (
      <Button
        icon="angle left"
        onClick={onBack}
        className={styles.backButton}
      />
    )}
    <div className={styles.content}>{children}</div>
  </SemanticUIPopup.Header>
));

export default PopupHeader;
