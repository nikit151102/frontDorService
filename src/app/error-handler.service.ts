import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentUserService } from './services/current-user.service';
import { TokenService } from './services/token.service';
import { Router } from '@angular/router';

export interface ErrorResponse {
    errorMessage: string;
    details: string;
    url: string;
    username: string;
    timestamp: string;
}

@Injectable({
    providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
    private apiUrl = 'https://vm-c486a4cd.na4u.ru:5001/logs/log-error/angular';

    constructor(private http: HttpClient,
        private currentUserService: CurrentUserService,
        private tokenService: TokenService,
        private router: Router
    ) { }

    handleError(error: any): void {

        // if (error.status === 401) {
        //     this.handleUnauthorizedError();
        //     return;
        // } else {
            const errorResponse: ErrorResponse = {
                errorMessage: error.message || 'Unknown Error',
                details: error.stack || 'No details',
                url: window.location.href,
                username: '',
                timestamp: new Date().toISOString(),
            };

            this.sendErrorToServer(errorResponse).subscribe({
                next: (response) => {
                    console.log('Error logged to server:', response);
                },
                error: (err) => {
                    console.error('Error while logging to server:', err);
                },
            });
        // }
    }

    private handleUnauthorizedError() {
        this.currentUserService.removeUser();
        this.tokenService.clearToken();
        this.router.navigate(['/login'], { state: { isSessionExpired: true } });
    }

    sendErrorToServer(error: ErrorResponse) {
        return this.http.post(this.apiUrl, error);
    }
}
