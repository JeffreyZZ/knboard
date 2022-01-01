import React from "react";
import { Input } from "semantic-ui-react";

import MaskedInput from "./MaskedInput";

interface Props {
  mask: string;
  maskChar: string;
}

// eslint-disable-next-line react/display-name
const InputMask = React.forwardRef(
  ({ mask, maskChar, ...props }: Props, ref) => (
    <Input
      {...props}
      // ref={ref}
      // input={<MaskedInput mask={mask} maskChar={maskChar} />}
    />
  )
);

InputMask.defaultProps = {
  maskChar: undefined,
};

export default React.memo(InputMask);
