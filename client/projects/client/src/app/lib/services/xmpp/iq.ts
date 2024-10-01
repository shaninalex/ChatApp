/**
 * This module describe how to get IQ type and handle this.
 */

import { Room, RoomParticipant, RoomType } from "@lib";
import { Store } from "@ngrx/store";
import { ChatParticipantsAddMany, ChatRoomsAdd } from "@store/chat/actions";
import { Disco, DiscoItem, DiscoItems, IQ, IQPayload } from "stanza/protocol";
import { selectRoomByJID } from "@store";
import { map, Observable, of } from "rxjs";
import { IXmppEventHandler } from "./interface";

// HANDLERS

/**
 * Need to process contact list ( roster )
 *
 * @class IQRosterHandler
 * @implements {IQHandler}
 */
class IQRosterHandler implements IXmppEventHandler {
    private store: Store;
    private iq: IQ;

    constructor(store: Store, iq: IQ) {
        this.store = store;
        this.iq = iq;
    }

    run(): Observable<any> {
        const items = this.iq.roster?.items;
        console.log(this.iq);
        if (!items) {
            return of(null);
        }
        

        return of(null);
    }
}

/**
 * Handle pubsub iq result. Store list of pubsub nodes
 * Also should handle user default pubsub ( created on registered )
 * If user SHOULD be subscribed to pubsub list.
 *
 * @class IQPubSubHandler
 * @implements {IQHandler}
 */
class IQPubSubHandler implements IXmppEventHandler {
    private store: Store;
    private iq: IQ;

    constructor(store: Store, iq: IQ) {
        this.store = store;
        this.iq = iq;
    }

    run(): Observable<any> {
        return of(null)
    }
}


/**
 * Process list of active conversations where user participating.
 *
 * @class IQDiscoHandler
 * @implements {IQHandler}
 */
class IQDiscoHandler implements IXmppEventHandler {
    private store: Store;
    private iq: IQ;

    constructor(store: Store, iq: IQ) {
        this.store = store;
        this.iq = iq;
    }

    run(): Observable<any> {
        if (!this.iq.disco) return of(null);
        const disco: Disco = this.iq.disco;

        if (disco.type === 'items') {
            if (!disco.items || !this.iq.from) return of(null);

            return this.store.select(selectRoomByJID(this.iq.from)).pipe(
                map((room: Room | undefined) => {
                    if (!disco.items) return of(null);
                    if (room) {
                        this.saveParticipants(disco.items);
                    } else {
                        this.saveRooms(disco.items);
                    }
                    return null;
                })
            );
        } else if (disco.type === 'info') {
            console.log('Disco type info:', disco);
            return of(null);
        }
        
        return of(null); // Default case
    }

    private saveParticipants(items: DiscoItem[]) {
        const participants: RoomParticipant[] = items.map(data => ({
            jid: data.jid as string,
            name: data.name as string,
        }))
        this.store.dispatch(ChatParticipantsAddMany({ participants }))
    }

    private saveRooms(items: DiscoItem[]) {
        for (let i = 0; i < items.length; i++) {
            const discoItem = items[i];
            const room: Room = {
                jid: discoItem.jid as string,
                name: discoItem.name as string,
                unread: 0,
                image: "/assets/images/default-image.jpg",
                type: RoomType.group,
                owner: "",
                moderators: [],
                parent: null,
                preview: "",
                selected: false
            }
            this.store.dispatch(ChatRoomsAdd({ payload: room }))
        }
    }
}

/**
 * Get IQ with VCard and save it to particular entity
 *
 * @class IQVCardHandler
 * @implements {IQHandler}
 */
class IQVCardHandler implements IXmppEventHandler {
    private store: Store;
    private iq: IQ;

    constructor(store: Store, iq: IQ) {
        this.store = store;
        this.iq = iq;
    }

    run(): Observable<any> {
        return of(null)
    }
}

export class IQManager {
    private processor: IXmppEventHandler

    constructor(store: Store, iq: IQ) {
        if (iq.roster) {
            this.processor = new IQRosterHandler(store, iq)
            return
        } else if (iq.pubsub) {
            this.processor = new IQPubSubHandler(store, iq)
            return
        } else if (iq.disco) {
            this.processor = new IQDiscoHandler(store, iq)
            return
        } else if (iq.vcard) {
            this.processor = new IQVCardHandler(store, iq)
            return
        }
    }

    handle(): Observable<any> {
        if (!this.processor) return of(null)
        return this.processor?.run()
    }
}
