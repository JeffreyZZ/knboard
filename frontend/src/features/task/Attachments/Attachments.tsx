import React, { useCallback } from "react";
import { Button } from "semantic-ui-react";
import { useToggle } from "../../../utils/hooks";

import Item from "./Item";

import styles from "./Attachments.module.scss";

interface Props {
  items: any;
  onUpdate: any;
  onDelete: any;
  onCoverUpdate: any;
}

// eslint-disable-next-line react/display-name
const Attachments = React.memo(
  ({ items, onUpdate, onDelete, onCoverUpdate }: Props) => {
    const [isOpened, toggleOpened] = useToggle();

    const handleToggleClick = useCallback(() => {
      toggleOpened();
    }, [toggleOpened]);

    const handleCoverSelect = useCallback(
      (id) => {
        onCoverUpdate(id);
      },
      [onCoverUpdate]
    );

    const handleCoverDeselect = useCallback(() => {
      onCoverUpdate(null);
    }, [onCoverUpdate]);

    const handleUpdate = useCallback(
      (id, data) => {
        onUpdate(id, data);
      },
      [onUpdate]
    );

    const handleDelete = useCallback(
      (id) => {
        onDelete(id);
      },
      [onDelete]
    );

    const visibleItems = isOpened ? items : items.slice(0, 4);

    return (
      <>
        {visibleItems.map((item) => (
          <Item
            key={item.id}
            name={item.name}
            url={item.url}
            coverUrl={item.coverUrl}
            createdAt={item.createdAt}
            isCover={item.isCover}
            isPersisted={item.isPersisted}
            onCoverSelect={() => handleCoverSelect(item.id)}
            onCoverDeselect={handleCoverDeselect}
            onUpdate={(data: any) => handleUpdate(item.id, data)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
        {items.length > 4 && (
          <Button
            fluid
            content={
              isOpened
                ? "action.showFewerAttachments"
                : "action.showAllAttachments"
            }
            className={styles.toggleButton}
            onClick={handleToggleClick}
          />
        )}
      </>
    );
  }
);

export default Attachments;
