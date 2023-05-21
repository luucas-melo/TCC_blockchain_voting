import { ReactElement } from "react";
import { FieldError } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  forwardRef,
  Input as ChakraInput,
  InputAddonProps,
  InputElementProps,
  InputGroup,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";

export interface InputProps extends ChakraInputProps {
  label?: string | JSX.Element;
  /**
   * React Hook Form error object or object containing the error message.
   *
   * @example
   *   const {
   *     formState: { errors },
   *   } = useForm<{ password: string }>();
   *   <Input errors={errors?.password} />;
   */
  errors?: FieldError | undefined;
  rightElement?: ReactElement<InputElementProps>;
  leftElement?: ReactElement<InputElementProps>;
  rightAddon?: ReactElement<InputAddonProps>;
  leftAddon?: ReactElement<InputAddonProps>;
  helperText?: string;
}

/**
 * This component is a wrapper around the Chakra UI Input component.
 *
 * Renders a input field with a FormLabel and a FormErrorMessage.
 *
 * Also, it wraps the field in a InputGroup to support chakra's InputAddon &
 * InputElement.
 *
 * @see Docs https://chakra-ui.com/docs/components/input/usage#add-elements-inside-input
 */
export const Input = forwardRef<InputProps, "input">((props, ref) => {
  const {
    label,
    errors,
    rightElement,
    leftElement,
    rightAddon,
    leftAddon,
    size,
    width,
    flex,
    helperText,
    ...rest
  } = props;

  return (
    <FormControl
      isInvalid={Boolean(errors)}
      width={width || "100%"}
      isRequired={props?.required || props?.isRequired}
      isDisabled={props?.isDisabled}
      flex={flex}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup size={size}>
        {leftAddon ?? null}
        {leftElement ?? null}
        <ChakraInput {...rest} ref={ref} />
        {rightAddon ?? null}
        {rightElement ?? null}
      </InputGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage color="red.300">{errors?.message}</FormErrorMessage>
    </FormControl>
  );
});
