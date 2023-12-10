import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Traits } from '../typedefs/identity';
import { Observable, map, shareReplay } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from './store';
import { selectTraits } from './store/identity/selectors';
import { XmppService } from './services/xmpp.service';
import { ProfileService } from './services/profile.service';
import { HttpClient } from '@angular/common/http';
import { SetIdentity } from './store/identity/actions';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnDestroy {
    identity$: Observable<Traits | undefined>;

    constructor(
        private store: Store<IAppState>,
        private xmpp: XmppService,
        private profile: ProfileService,
        private http: HttpClient
    ) {

        const session = http.get<any>(`/api/v2/auth/session`, { withCredentials: true }).pipe(
            // finalize(() => ui.loading.next(false)),
            shareReplay()
        );
        
        session.subscribe({
            next: data => this.store.dispatch(SetIdentity({user_info: data}))
        });
        // this.identity$ = this.store.select(selectTraits);
        // this.profile.getCredentials().subscribe({
        //     next: data => this.xmpp.connect(data.jid, data.token)
        // });
    }

    ngOnDestroy(): void {
        this.xmpp.disconnect();
    }
}
