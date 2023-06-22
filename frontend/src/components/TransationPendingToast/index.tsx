import { Link } from "@chakra-ui/next-js";
import { Toast, ToastProps } from "@chakra-ui/react";

interface TransactionPendingToastProps extends ToastProps {
  transactionHash: string;
}

export function TransactionPendingToast(props: TransactionPendingToastProps) {
  const { transactionHash, ...toastProps } = props;

  return (
    <Toast
      status="loading"
      title="Aguarde a confirmação da transação"
      description={
        <Link
          // color="white"
          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
          target="_blank"
        >
          Clique aqui para acompanhar a transação
        </Link>
      }
      {...toastProps}
    />
  );
}
