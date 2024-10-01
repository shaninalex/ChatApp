import { Store } from "@ngrx/store";
import { ReceivedPresence } from "stanza/protocol";
import { IXmppEventHandler } from "./interface";


export class PresenceManager {
    private processor: IXmppEventHandler;

    constructor(store: Store, msg: ReceivedPresence) {
    }

    handle(): void {
        if (!this.processor) return;
        this.processor.run();
    }
}