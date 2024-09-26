import { createReducer, createSelector, on } from "@ngrx/store";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import * as actions from '../actions';
import { Room } from "../def";
import { selectXmppFeature } from "../selectors";
import { XmppState } from "../reducer";
import { DiscoItem, DiscoItems } from "stanza/protocol";

export interface RoomsState extends EntityState<DiscoItem> { }
export const RoomsAdapter: EntityAdapter<DiscoItem> = createEntityAdapter<DiscoItem>();
export const initialRooms: RoomsState = RoomsAdapter.getInitialState();

export const roomsReducer = createReducer(
    initialRooms,
    on(actions.ChatRoomAdd, (state, { payload }) => RoomsAdapter.addOne(payload, state)),
)

export const selectRoomsFeature = createSelector(
    selectXmppFeature,
    (state: XmppState) => state.rooms
)

export const selectRoomsAll = createSelector(
    selectRoomsFeature,
    RoomsAdapter.getSelectors().selectAll
);
