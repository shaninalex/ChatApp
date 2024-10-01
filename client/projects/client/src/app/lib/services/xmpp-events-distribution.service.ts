import { Injectable, OnDestroy } from "@angular/core";
import { AppState } from "@store/store";
import { Store } from "@ngrx/store";
import { filter,  Subscription, switchMap, take, tap } from "rxjs";
import { ReceivedIQ, ReceivedMessage } from "stanza/protocol";
import { XmppService } from "./xmpp.service";
import { IQManager } from "./xmpp/iq";
import { MessageManager } from "./xmpp/message";
import { PresenceManager } from "./xmpp/presence";


/**
 *
 * Service to save event data from xmpp to NGRX It will help to
 * subscribe only for store selectors instead of direct consuming
 * for XmppService. The idea is to have single point in application
 * where we subscribe to all xmpp events
 *
 * @export
 * @class EventsDistributionService
 */
@Injectable()
export class XmppEventsDistributionService implements OnDestroy {
    sub: Subscription = new Subscription
    constructor(private store: Store<AppState>) { }

    ngOnDestroy(): void {
        this.sub.unsubscribe()
    }

    start(xmpp: XmppService) {
        this.sub.add(
            xmpp.connected$.pipe(
                filter(connect => connect),
                take(1),
                tap(() => {

                    // run initial queries
                    this.initialQueries(xmpp);

                    // provide event sources to distribution service
                    this.distribute(xmpp);
                }),
            ).subscribe()
        )
    }

    initialQueries(xmpp: XmppService): void {
        // get static list of rooms
        this.sub.add(
            xmpp.queryRoomsOnline().subscribe()
        );

        // pubsub
        this.sub.add(
            xmpp.getPubsub().subscribe()
        );

        // contact list
        this.sub.add(
            xmpp.getRoster().subscribe()
        );
    }

    /**
     *
     * Distribute and store events data from xmpp
     *
     */
    distribute(xmpp: XmppService): void {
        if (!xmpp) return
        this.sub.add(
            xmpp.receivedIQ$.pipe(
                switchMap((iq: ReceivedIQ, _) => {
                    const ctx = new IQManager(this.store, iq);
                    return ctx.handle();
                })
            ).subscribe()
        );

        this.sub.add(
            xmpp.receivedMessage$.pipe(
                switchMap((msg: ReceivedMessage, _) => {
                    const ctx = new MessageManager(this.store, msg);
                    return ctx.handle();
                })
            ).subscribe()
        );

        this.sub.add(
            xmpp.receivedPresence$.subscribe(presence => {
                const ctx = new PresenceManager(this.store, presence);
                ctx.handle();
            })
        );
    }
}
