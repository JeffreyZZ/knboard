import React, { useCallback, useRef } from "react";
import styles from "./FilePicker.module.css";

interface Props {
  children: any;
  accept?: string;
  onSelect?: any;
}

const FilePicker = React.memo(({ children, accept, onSelect }: Props) => {
  const field = useRef(children);

  const handleTriggerClick = useCallback(() => {
    field.current.click();
  }, []);

  const handleFieldChange = useCallback(
    ({ target }) => {
      if (target.files[0]) {
        onSelect(target.files[0]);

        target.value = null; // eslint-disable-line no-param-reassign
      }
    },
    [onSelect]
  );

  const tigger = React.cloneElement(children, {
    onClick: handleTriggerClick,
  });

  return (
    <>
      {tigger}
      <input
        ref={field}
        type="file"
        accept={accept}
        className={styles.Field}
        onChange={handleFieldChange}
      />
    </>
  );
});

export default FilePicker;
