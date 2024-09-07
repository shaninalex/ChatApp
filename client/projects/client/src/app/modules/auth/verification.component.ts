
import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import { UiNode, UiText } from "@ory/kratos-client";
import { setFormControllsFromNodes } from "@lib";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "app-verification-login",
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
} @else {
    <p>loading...</p>
}`
})
export class VerificationComponent implements OnInit {
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
        this.form = this.fb.group({});
        this.route.queryParams.subscribe({
            next: params => {
                this.authService.GetVerificationForm(params["flow"]).subscribe({
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
        });
    }
}
