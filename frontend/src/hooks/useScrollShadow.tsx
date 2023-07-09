import { Box, useColorMode, useToken } from "@chakra-ui/react";
import {
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useScrollShadow = () => {
  const [shadowColorLight, shadowColorDark] = useToken(
    // the key within the theme, in this case `theme.colors`
    "colors",
    // the subkey(s), resolving to `theme.colors.red.100`
    ["blackAlpha.300", "whiteAlpha.400"]
    // a single fallback or fallback array matching the length of the previous arg
  );

  const { colorMode } = useColorMode();

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const onScrollHandler = useCallback<UIEventHandler<HTMLDivElement>>(
    (event) => {
      setScrollTop(event.currentTarget.scrollTop);
      setScrollHeight(event.currentTarget.scrollHeight);
      setClientHeight(event.currentTarget.clientHeight);
    },
    []
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set wrapper styles
    if (wrapperRef?.current) {
      wrapperRef.current.style.position =
        wrapperRef.current.style.position || "relative";
      wrapperRef.current.style.overflow =
        wrapperRef.current.style.overflow || "auto";
      wrapperRef.current.style.maxHeight =
        wrapperRef.current.style.maxHeight || "130px";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on ref change
  }, [wrapperRef?.current]);

  useEffect(() => {
    if (!wrapperRef?.current) return;

    setScrollTop(wrapperRef.current.scrollTop);
    setScrollHeight(wrapperRef.current.scrollHeight);
    setClientHeight(wrapperRef.current.clientHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on height change
  }, [wrapperRef.current?.clientHeight]);

  const getVisibleSides = useCallback((): { top: boolean; bottom: boolean } => {
    const isBottom = clientHeight === scrollHeight - scrollTop;
    const isTop = scrollTop === 0;
    const isBetween = scrollTop > 0 && clientHeight < scrollHeight - scrollTop;

    return {
      top: (isBottom || isBetween) && !(isTop && isBottom),
      bottom: (isTop || isBetween) && !(isTop && isBottom),
    };
  }, [clientHeight, scrollHeight, scrollTop]);

  // eslint-disable-next-line @typescript-eslint/naming-convention -- ShadowTop is a component
  const ShadowTop = useCallback(
    () => (
      <Box
        position="sticky"
        top={0}
        // marginBottom={-4}
        boxShadow={`0px 0px 8px 2px ${
          colorMode === "light" ? shadowColorLight : shadowColorDark
        }`}
        opacity={getVisibleSides().top ? 1 : 0}
        transition="opacity 0.2s ease-out"
      />
    ),
    [colorMode, getVisibleSides, shadowColorDark, shadowColorLight]
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention -- ShadowBottom is a component
  const ShadowBottom = useCallback(
    () => (
      <Box
        position="sticky"
        bottom={0}
        // marginTop={-4}
        boxShadow={`0px 0px 8px 2px ${
          colorMode === "light" ? shadowColorLight : shadowColorDark
        }`}
        opacity={getVisibleSides().bottom ? 1 : 0}
        transition="opacity 0.2s ease-out"
      />
    ),
    [colorMode, getVisibleSides, shadowColorDark, shadowColorLight]
  );

  return {
    wrapperRef,
    onScrollHandler,
    ShadowTop,
    ShadowBottom,
  };
};
