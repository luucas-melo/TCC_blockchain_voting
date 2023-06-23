import { EditVotingModal } from "@/components/EditVotingModal";
import {
  getContractData,
  VotingContract,
  VotingFactoryContract,
} from "@/lib/contracts";

export async function generateStaticParams() {
  const contracts = await VotingFactoryContract.methods
    .getDeployedContracts()
    .call();

  console.log("generateStaticParams ~ contracts:", contracts);

  return contracts.map((contract) => ({
    contract,
  }));
}

export default async function EditVoting({
  params,
}: {
  params: { contract: string };
}) {
  const { contract: contractAddress } = params;

  const votingContract = VotingContract(contractAddress);
  const data = await getContractData(votingContract)();
  console.log("voting contract data:", data);
  // fake await
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });

  const convertToDateTimeLocalString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <EditVotingModal
      contractAddress={contractAddress}
      defaultValues={{
        title: data.title,
        proposals: data.proposals.join("\n"),
        whiteList: data.whiteList.join("\n"),
        deadline: convertToDateTimeLocalString(
          new Date(Number(data?.votingDuration) * 1000)
        ),
      }}
    />
  );
}
