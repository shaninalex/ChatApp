import { createAction, props } from "@ngrx/store";
import { Room } from "./def";
import { ReceivedMessage, ReceivedPresence } from "stanza/protocol";

// build name of actions like this:
// module: Chat
// submodule: Rooms
// actions: Add
// ChatRoomsAdd

export const ChatRoomAdd = createAction(
    "[chat] add room",
    props<{ payload: Room }>()
)

export const ChatMessageAdd = createAction(
    "[chat] add message",
    props<{ payload: ReceivedMessage }>()
)

export const ChatParticipantAdd = createAction(
    "[chat] add participant",
    props<{ payload: ReceivedPresence }>()
)

export const ChatParticipantRemove = createAction(
    "[chat] remove participant",
    props<{ id: string }>()
)