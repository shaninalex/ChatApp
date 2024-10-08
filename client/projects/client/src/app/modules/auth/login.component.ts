import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import { UiNode, UiText } from "@ory/kratos-client";
import { setFormControllsFromNodes } from "@lib";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "app-auth-login",
    template: `
@if(loaded) {
    <ui-form-messages [messages]="messages" />
    @if (nodes) {
        <form [action]="actionUrl" method="post" class="flex flex-col gap-3 mb-3">
            @for (node of nodes; track node) {
                <ui-kratos-input [node]="node" />
            }
        </form>
    }

    Don't have an account? <a [routerLink]="['/auth/registration']" class="underline">Registration</a> <br />
    Forgot password? <a [routerLink]="['/auth/recovery']" class="underline">Recovery</a>
} @else {
    <p>loading...</p>
}`
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    nodes: Array<UiNode> = [];
    actionUrl: string;
    messages?: Array<UiText>;
    loaded: boolean = false

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        public fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({})

        this.route.queryParams.subscribe({
            next: params => {
                const flowId = params["flow"];
                if (!flowId) {
                    // TODO: this link should not be hardcoded !
                    window.location.href = "http://localhost:4433/self-service/login/browser";
                } else {
                    this.authService.GetLoginForm(params["flow"]).subscribe({
                        next: resp => {
                            this.nodes = resp.data.ui.nodes;
                            this.actionUrl = resp.data.ui.action;
                            this.messages = resp.data.ui.messages;
                            setFormControllsFromNodes(resp.data.ui.nodes, this.form)
                            this.loaded = true
                        },
                        error: (error: HttpErrorResponse) => {
                            console.error(error.status);
                        }
                    });
                }
            }
        });
        // TODO: unsubscribe???
    }
}
