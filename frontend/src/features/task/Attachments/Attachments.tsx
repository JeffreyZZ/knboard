import React, { useCallback } from "react";
import { Button } from "semantic-ui-react";
import { useToggle } from "../../../utils/hooks";

import Item from "./Item";

import styles from "./Attachments.module.scss";
import { IAttachImage } from "types";

interface Props {
  images: IAttachImage[];
  coverId: number;
  itemId: string;
  onUpdate: any;
  onDelete: any;
  onCoverUpdate: any;
}

// eslint-disable-next-line react/display-name
const Attachments = React.memo(
  ({ images, coverId, itemId, onUpdate, onDelete, onCoverUpdate }: Props) => {
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
      (id, itemId) => {
        onDelete(id, itemId);
      },
      [onDelete]
    );

    const visibleItems = isOpened ? images : images.slice(0, 4);

    return (
      <>
        {visibleItems.map((image) => (
          <Item
            key={image.id}
            name={image.title}
            url={image.image}
            coverUrl={image.image}
            created={image.created}
            isCover={image.id == coverId}
            isPersisted={true}
            onCoverSelect={() => handleCoverSelect(image.id)}
            onCoverDeselect={handleCoverDeselect}
            onUpdate={(data: any) => handleUpdate(image.id, data)}
            onDelete={() => handleDelete(image.id, itemId)}
          />
        ))}
        {images.length > 4 && (
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
