import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TokenService } from "../services/token.service";

export interface RegisterPayload {
    email: string
    password: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    exp: number
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient,
                private tokenService: TokenService,
                private router: Router) {}

    register(register_payload: RegisterPayload): void {
        this.http.post<any>("/api/v1/auth", register_payload).subscribe({
            next: result => {
                this.tokenService.saveToken(result.access_token);
                this.router.navigate(['/']);
            }
        })
    }

    login(login_payload: LoginPayload): void {
        this.http.post<LoginResponse>("/api/v1/auth/login", login_payload).subscribe({
            next: result => {
                this.tokenService.saveToken(result.access_token);
                this.router.navigate(['/']);
            }
        });
    }
}
