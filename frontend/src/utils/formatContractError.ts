export const formatContractError = (e: unknown) =>
  // @ts-expect-error
  e?.toJSON()?.data?.message?.split(":")?.[1] ||
  // @ts-expect-error
  e?.toJSON()?.data?.originalError?.message?.split(":")?.[1] ||
  (e as Error)?.message;
