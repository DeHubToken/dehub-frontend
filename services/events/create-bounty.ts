import SharedEventTracker from "./event-tracker";

export const getResultFromCreateBountyModal = async (data: unknown): Promise<unknown> =>
  await SharedEventTracker.startActionAsync("CreateBountyModalEvent", { data });

export const getResultFromNetworkModal = async (data: unknown): Promise<boolean> =>
  (await SharedEventTracker.startActionAsync("NetworkModalEvent", { data })) as unknown as boolean;

export const getResultFromPPVModal = async (data: unknown): Promise<unknown> =>
  await SharedEventTracker.startActionAsync("ConfirmModalForPPVEvent", {
    selectedNftMetadata: data
  });
