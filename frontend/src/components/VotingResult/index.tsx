"use client";

import { Box, useColorMode } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IVotingResultProps {
  votingResult: number[];
  proposals: string[];
}

export function VotingResult({ proposals, votingResult }: IVotingResultProps) {
  const { colorMode } = useColorMode();

  const data = votingResult?.map((item) => Number(item));

  const options = {
    labels: proposals,
    legend: {
      show: true,
      labels: {
        colors: colorMode === "light" ? "#313131" : "#fff",
      },
      // position: "bottom",
    },
    theme: {
      palette: "palette4",
    },
  } as ApexOptions;

  return (
    <Box>
      <Chart
        options={options}
        series={data}
        width={400}
        height={400}
        type="donut"
      />
    </Box>
  );
}
