import React, { useCallback } from "react";
import classNames from "classnames";
import { Button, Icon, Label, Loader } from "semantic-ui-react";

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

    const handleDeleteImageClick = useCallback(
      (event) => {
        event.stopPropagation();
        onDelete();
      },
      [onDelete]
    );

    if (!isPersisted) {
      return (
        <div className={classNames(styles.wrapper, styles.wrapperSubmitting)}>
          <Loader inverted />
        </div>
      );
    }

    const filename = url?.split("/").pop();
    const extension = filename?.slice(
      (Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1
    );

    if (!filename) {
      return;
    }

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
                  color: "orange",
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
        <Button
          icon
          className={classNames(styles.button, styles.target)}
          onClick={handleDeleteImageClick}
        >
          <Icon name="trash" />
        </Button>
      </div>
    );
  }
);

export default Item;
