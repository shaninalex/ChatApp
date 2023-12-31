import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recovery',
  template: `<app-generated-form [form$]="form$"></app-generated-form>`
})
export class RecoveryComponent {
    form$: Observable<any>;

    constructor(
        private auth: AuthService,
        private route: ActivatedRoute
    ) {
        this.route.queryParams.subscribe(data => this.form$ = this.auth.getRecoveryFlow(data["flow"]));
    }
}
