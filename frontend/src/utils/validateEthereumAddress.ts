export const validateEthereumAddress = (value: string) => {
  console.log("value", value);
  const isValid = value
    .trim()
    .split("\n")
    .every((data) => data.match(/^0x[0-9a-fA-F]{40}$/));

  return isValid || "Endereço Ethereum inválido";
};
