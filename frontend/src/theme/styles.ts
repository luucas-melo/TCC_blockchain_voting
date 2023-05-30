import type { StyleFunctionProps, Theme } from "@chakra-ui/react";
// import { mode } from '@chakra-ui/theme-tools'

export const styles: Theme["styles"] = {
  global: (props: StyleFunctionProps) => ({
    body: {
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",

      _dark: {
        backgroundImage: "linear-gradient(60deg, #29323c 0%, #485563 100%)",

        "&:before": {
          opacity: 0.45,
        },
        "&:after": {
          opacity: 0.45,
        },
      },

      backgroundSize: "cover",
      "&:before": {
        zIndex: -1,
        content: "''",
        display: "block",
        backgroundImage: "url(./waves.svg)",
        backgroundSize: "100% 100%",
        height: "25vh",
        width: "100%",
        position: "absolute",
        top: "0px",
        opacity: 0.06,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
      },
      "&:after": {
        "z-index": -1,
        content: "''",
        display: "block",
        backgroundImage: "url(./waves-2.svg)",
        backgroundSize: "100% 100%",
        height: "30vh",
        width: "100%",
        position: "absolute",
        bottom: "0px",
        opacity: 0.08,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
      },
    },

    main: {
      // Full Bleed layout
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
