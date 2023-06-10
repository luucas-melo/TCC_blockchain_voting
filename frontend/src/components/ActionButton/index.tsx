import {
  forwardRef,
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from "@chakra-ui/react";
import { memo } from "react";

export type ActionButtonProps = Omit<IconButtonProps, "aria-label"> & {
  /** The label to be displayed in the {@link Tooltip} */
  label?: string;
  /** The props to be passed to the {@link Tooltip} component. */
  tooltipProps?: Partial<TooltipProps>;
};

function ActionButtonInner(
  props: ActionButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const { label, tooltipProps, ...rest } = props;

  return (
    <Tooltip
      label={label}
      placement="top"
      openDelay={250}
      closeDelay={100}
      {...tooltipProps}
    >
      <IconButton
        aria-label={label || ""}
        variant="ghost"
        color="Primary.700"
        {...rest}
        ref={ref}
      />
    </Tooltip>
  );
}

ActionButtonInner.displayName = "ActionButton";

/** A Chakra's {@link IconButton} with a {@link Tooltip} label */
export const ActionButton = memo(forwardRef(ActionButtonInner)) as (
  props: ActionButtonProps & {
    ref?: React.ForwardedRef<HTMLButtonElement>;
  }
) => ReturnType<typeof ActionButtonInner>;
