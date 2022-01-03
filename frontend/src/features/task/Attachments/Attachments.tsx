import React, { useCallback } from "react";
import { Button } from "semantic-ui-react";
import { useToggle } from "../../../utils/hooks";

import Item from "./Item";

import styles from "./Attachments.module.scss";
import { IAttachImage } from "types";

interface Props {
  items: IAttachImage[];
  coverId: number;
  onUpdate: any;
  onDelete: any;
  onCoverUpdate: any;
}

// eslint-disable-next-line react/display-name
const Attachments = React.memo(
  ({ items, coverId, onUpdate, onDelete, onCoverUpdate }: Props) => {
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
            name={item.title}
            url={item.image}
            coverUrl={item.image}
            created={item.created}
            isCover={item.id == coverId}
            isPersisted={true}
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
              isOpened ? "Show Fewer Attachments" : "Show All Attachments"
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
