import { ReceivedMessage } from "stanza/protocol";
import { XmppService } from "../xmpp.service";
import { Store } from "@ngrx/store";
import { Message } from "@lib";
import { MessageType } from "stanza/Constants";
import { ChatMessageAdd } from "@store/chat/actions";
import { IXmppEventHandler } from "./interface";
import { Observable, of } from "rxjs";


function createMessage(msg: ReceivedMessage): Message {
    const message: Message = {
        from: msg.from,
        to: msg.to,
        id: "",
        timestamp: new Date(),
        body: "",
        read: false,
        type: MessageType.Normal,
    };

    if (msg.id) {
        message.id = msg.id;
    }

    if (msg.delay) {
        message.timestamp = new Date(msg.delay.timestamp);
    }

    if (msg.body) {
        message.body = msg.body;
    }

    if (msg.type) [
        message.type = msg.type
    ]

    return message
}

class MessagePayloadHandler implements IXmppEventHandler {
    private store: Store;
    private msg: ReceivedMessage;

    constructor(store: Store, msg: ReceivedMessage) {
        this.store = store;
        this.msg = msg;
    }
    run(): Observable<any> {
        const message = createMessage(this.msg);
        return of(this.store.dispatch(ChatMessageAdd({ message })))
    }
}

class MessageStateHandler implements IXmppEventHandler {
    private store: Store;
    private msg: ReceivedMessage;

    constructor(store: Store, msg: ReceivedMessage) {
        this.store = store;
        this.msg = msg;
    }
    run(): Observable<any> { 
        return of(null)
    }
}



export class MessageManager {
    private processor: IXmppEventHandler;

    constructor(store: Store, msg: ReceivedMessage) {
        if (msg.body) {
            this.processor = new MessagePayloadHandler(store, msg);
        } else {
            this.processor = new MessageStateHandler(store, msg);
        }
    }

    handle(): Observable<any> {
        if (!this.processor) return of(null)
        return this.processor.run();
    }
}
