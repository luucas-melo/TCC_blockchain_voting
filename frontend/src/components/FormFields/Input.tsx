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
import { ReactElement } from "react";
import { FieldError } from "react-hook-form";

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
  helperText?: string;
  rightElement?: ReactElement<InputElementProps>;
  leftElement?: ReactElement<InputElementProps>;
  rightAddon?: ReactElement<InputAddonProps>;
  leftAddon?: ReactElement<InputAddonProps>;
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
    helperText,
    rightElement,
    leftElement,
    rightAddon,
    leftAddon,
    size,
    width,
    flex,
    ...rest
  } = props;

  return (
    <FormControl
      isInvalid={Boolean(errors)}
      width={width || "auto"}
      isRequired={props?.required || props?.isRequired}
      isDisabled={props?.isDisabled}
      flex={flex}
    >
      <FormLabel marginBottom={1}>{label}</FormLabel>

      <InputGroup size={size}>
        {leftAddon ?? null}
        {leftElement ?? null}
        <ChakraInput ref={ref} {...rest} />
        {rightAddon ?? null}
        {rightElement ?? null}
      </InputGroup>

      <FormHelperText>{helperText}</FormHelperText>
      <FormErrorMessage color="red.300">{errors?.message}</FormErrorMessage>
    </FormControl>
  );
});
