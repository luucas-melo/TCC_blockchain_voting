import type { StyleFunctionProps, Theme } from "@chakra-ui/react";
// import { mode } from '@chakra-ui/theme-tools'

export const styles: Theme["styles"] = {
  global: (props: StyleFunctionProps) => ({
    body: {
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      backgroundSize: "cover",
      // backgroundAttachment: "fixed",
      wordBreak: "break-word",

      _dark: {
        // backgroundImage: "linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)",

        background: "#1e2028",

        "&:before": {
          opacity: 0.45,
        },
        "&:after": {
          opacity: 0.45,
        },
      },

      "&:before, &:after": {
        content: "''",
        display: "block",
        position: "fixed",
        width: "100%",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      },

      "&:before": {
        backgroundImage: "url(./waves.svg)",
        height: "25vh",
        top: "0px",
        opacity: 0.06,
        backgroundPosition: "left bottom",
      },
      "&:after": {
        backgroundImage: "url(./waves-2.svg)",
        height: "30vh",
        bottom: "0px",
        opacity: 0.08,
        backgroundPosition: "right bottom",
      },
    },

    main: {
      // Full Bleed layout
      backgroundAttachment: "fixed",
      display: "grid",
      gridTemplateColumns: [
        "minmax(0, 1fr) min(1024px, calc(100% - (2*var(--chakra-space-4)))) minmax(0, 1fr)",
        "minmax(0, 1fr) min(1024px, calc(100% - (2*var(--chakra-space-6)))) minmax(0, 1fr)",
        "minmax(0, 1fr) min(1024px, calc(100% - (2*var(--chakra-space-8)))) minmax(0, 1fr)",
      ],
      gridTemplateRows: "auto 1fr auto", // padding top/bottom
      // py: ["4", "6", "8"],
      gap: ["4", "6", "8"],
      minBlockSize: "100vh",
      "> *": {
        gridColumn: 2,
        gridRow: 2,
      },
    },
  }),
};
