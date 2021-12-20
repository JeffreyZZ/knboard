import React, { useCallback } from "react";
import { Menu } from "semantic-ui-react";
import withPopup from "../../components/Popup/with-popup";
import Popup from "../../components/Popup/Popup";
import FilePicker from "../../components/FilePicker/FilePicker";

import styles from "./AttachmentAddPopup.module.scss";

interface Props {
  onCreate: any;
  onClose: any;
}

// eslint-disable-next-line react/display-name
const AttachmentAddStep = React.memo(({ onCreate, onClose }: Props) => {
  const handleFileSelect = useCallback(
    (file) => {
      onCreate({
        file,
      });
      onClose();
    },
    [onCreate, onClose]
  );

  return (
    <>
      <Popup.Header>Add Attachement</Popup.Header>
      <Popup.Content>
        <Menu secondary vertical className={styles.menu}>
          <FilePicker onSelect={handleFileSelect}>
            <Menu.Item className={styles.menuItem}>From Computer</Menu.Item>
          </FilePicker>
        </Menu>
        <hr className={styles.divider} />
        <div className={styles.tip}>
          pressPasteShortcutToAddAttachmentFromClipboard
        </div>
      </Popup.Content>
    </>
  );
});

export default withPopup(AttachmentAddStep);
