export const formatContractErro = (e: Error) => {
  const error =
    e?.toJSON()?.data?.message?.split(":")?.[1]?.replace("revert", "") ||
    (e as Error)?.message;

  return error.trim();
};
