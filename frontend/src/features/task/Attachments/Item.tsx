import React, { useCallback } from "react";
import classNames from "classnames";
import { Button, Icon, Label, Loader } from "semantic-ui-react";

import EditPopup from "./EditPopup";

import styles from "./Item.module.scss";

interface Props {
  name: string;
  url: string;
  coverUrl: string;
  created: Date;
  isCover: boolean;
  isPersisted: boolean;
  onCoverSelect: any;
  onCoverDeselect: any;
  onUpdate: any;
  onDelete: any;
}

// eslint-disable-next-line react/display-name
const Item = React.memo(
  ({
    name,
    url,
    coverUrl,
    created,
    isCover,
    isPersisted,
    onCoverSelect,
    onCoverDeselect,
    onUpdate,
    onDelete,
  }: Props) => {
    const handleClick = useCallback(() => {
      window.open(url, "_blank");
    }, [url]);

    const handleToggleCoverClick = useCallback(
      (event) => {
        event.stopPropagation();

        if (isCover) {
          onCoverDeselect();
        } else {
          onCoverSelect();
        }
      },
      [isCover, onCoverSelect, onCoverDeselect]
    );

    if (!isPersisted) {
      return (
        <div className={classNames(styles.wrapper, styles.wrapperSubmitting)}>
          <Loader inverted />
        </div>
      );
    }

    const filename = url.split("/").pop();
    const extension = filename?.slice(
      (Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1
    );

    return (
      <div className={styles.wrapper} onClick={handleClick}>
        <div
          className={styles.thumbnail}
          style={{
            background: coverUrl && `url("${coverUrl}") center / cover`,
          }}
        >
          {coverUrl ? (
            isCover && (
              <Label
                corner="left"
                size="mini"
                icon={{
                  name: "star",
                  color: "grey",
                  inverted: true,
                }}
                className={styles.thumbnailLabel}
              />
            )
          ) : (
            <span className={styles.extension}>{extension || "-"}</span>
          )}
        </div>
        <div className={styles.details}>
          <span className={styles.name}>{name}</span>
          <span className={styles.date}>
            {new Date(created).toLocaleString()}
          </span>
          {coverUrl && (
            <span className={styles.options}>
              <button
                type="button"
                className={styles.option}
                onClick={handleToggleCoverClick}
              >
                <Icon
                  name="window maximize outline"
                  flipped="vertically"
                  size="small"
                  className={styles.optionIcon}
                />
                <span className={styles.optionText}>
                  {isCover ? "Remove Cover" : "Make Cover"}
                </span>
              </button>
            </span>
          )}
        </div>
        <EditPopup
          defaultData={{
            name,
          }}
          onUpdate={onUpdate}
          onDelete={onDelete}
        >
          <Button className={classNames(styles.button, styles.target)}>
            <Icon fitted name="pencil" size="small" />
          </Button>
        </EditPopup>
      </div>
    );
  }
);

export default Item;
