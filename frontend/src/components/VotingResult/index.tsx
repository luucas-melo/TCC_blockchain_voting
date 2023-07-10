"use client";

import { Box, Flex, Heading, Icon, useColorMode } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { BsInfoCircle } from "react-icons/bs";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IVotingResultProps {
  votingResult: number[];
  proposals: string[];
}

export function VotingResult({ proposals, votingResult }: IVotingResultProps) {
  const { colorMode } = useColorMode();

  const data = votingResult?.map((item) => Number(item));
  const allZero = data.every((value) => value === 0);

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
    <Box marginBottom={16}>
      {!allZero ? (
        <Chart
          options={options}
          series={data}
          width="100%"
          height={400}
          type="donut"
        />
      ) : (
        <Flex alignItems="center" gap={4}>
          <Icon boxSize={7} color="blue.200" as={BsInfoCircle} />
          <Heading color="blue.200" fontWeight="normal" fontSize="xl">
            Esta votação foi finalizada sem receber votos.
          </Heading>
        </Flex>
      )}
    </Box>
  );
}
