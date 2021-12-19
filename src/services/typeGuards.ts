import { DeltaDTO, MessageDTO, SnapshotDTO } from "./../types/dto";

export const isSnapshotDTO = (message: MessageDTO): message is SnapshotDTO =>
  message.feed === "book_ui_1_snapshot";

export const isDeltaDTO = (message: MessageDTO): message is DeltaDTO =>
  message.feed === "book_ui_1" &&
  Array.isArray((message as any).asks) &&
  Array.isArray((message as any).bids);
