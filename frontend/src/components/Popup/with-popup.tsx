import React, { useCallback, useState } from "react";
import { Button, Popup as SemanticUIPopup } from "semantic-ui-react";

import styles from "./Popup.module.css";

interface Props {
  children: any;
  /* 
    This dynamic keys for TypeScript interface to allow add properites dynamicially.
    For this popup component, it uses the dyanmic properties to pass in functions
    related to components wrapped by the popup. This is flexible design for the popup
    to wrap other components.
  */
  [key: string]: any;
}

export default (WrappedComponent) => {
  const Popup = React.memo(({ children, ...props }: Props) => {
    const [isOpened, setIsOpened] = useState(false);

    const handleOpen = useCallback(() => {
      setIsOpened(true);
    }, []);

    const handleClose = useCallback(() => {
      setIsOpened(false);
    }, []);

    const handleMouseDown = useCallback((event) => {
      event.stopPropagation();
    }, []);

    const handleClick = useCallback((event) => {
      event.stopPropagation();
    }, []);

    const handleTriggerClick = useCallback(
      (event) => {
        event.stopPropagation();

        const { onClick } = children;

        if (onClick) {
          onClick(event);
        }
      },
      [children]
    );

    const tigger = React.cloneElement(children, {
      onClick: handleTriggerClick,
    });

    return (
      <SemanticUIPopup
        basic
        wide
        trigger={tigger}
        on="click"
        open={isOpened}
        position="bottom left"
        popperModifiers={[
          {
            name: "preventOverflow",
            options: {
              boundariesElement: "window",
            },
          },
        ]}
        className={styles.wrapper}
        onOpen={handleOpen}
        onClose={handleClose}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <Button
          icon="close"
          onClick={handleClose}
          className={styles.closeButton}
        />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <WrappedComponent {...props} onClose={handleClose} />
      </SemanticUIPopup>
    );
  });

  return Popup;
};
