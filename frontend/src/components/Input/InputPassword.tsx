import React, { useCallback } from "react";
import { Icon, Input } from "semantic-ui-react";
import { useToggle } from "../../utils/hooks";

// eslint-disable-next-line react/display-name
const InputPassword = React.forwardRef<any>((props, ref) => {
  const [isVisible, toggleVisible] = useToggle();

  const handleToggleClick = useCallback(() => {
    toggleVisible();
  }, [toggleVisible]);

  return (
    <Input
      {...props}
      ref={ref}
      type={isVisible ? "text" : "password"}
      icon={
        <Icon
          link
          name={isVisible ? "eye" : "eye slash"}
          onClick={handleToggleClick}
        />
      }
    />
  );
});

export default React.memo(InputPassword);
