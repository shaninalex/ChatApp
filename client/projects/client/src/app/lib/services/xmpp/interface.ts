import { Observable } from "rxjs";

export interface IXmppEventHandler {
    run(): Observable<any>
}