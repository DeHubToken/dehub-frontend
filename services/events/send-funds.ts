import SharedEventTracker from "./event-tracker";

export const sendFundsEvent = async (data: unknown) =>
  await SharedEventTracker.startActionAsync("SendFundsModalEvent", { data });
