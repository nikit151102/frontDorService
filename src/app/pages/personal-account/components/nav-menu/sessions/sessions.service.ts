import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtService } from '../../../../../services/jwt.service';
import { ToastService } from '../../../../../services/toast.service';
import { Router } from '@angular/router';
import { CacheReferenceService } from '../../../../../services/cache-reference.service';
import { TokenService } from '../../../../../services/token.service';

@Injectable({
    providedIn: 'root'
})
export class SessionsService {
    private socket: WebSocket | undefined;
    private sessionSubject = new BehaviorSubject<any>(null);
    sessions$ = this.sessionSubject.asObservable();

    constructor(
        private http: HttpClient,
        private jwtService: JwtService,
        private toastService: ToastService,
        private router: Router,
        private tokenService: TokenService,
        private cacheService: CacheReferenceService,
    ) { }

    setNotifications(value: any): void {
        this.sessionSubject.next(value);
    }

    getNotifications(): any {
        return this.sessionSubject.value;
    }

    updateSessionProperty(newItem: any): void {
        const current = this.getNotifications() || [];

        if (!Array.isArray(current)) {
            this.setNotifications([newItem]);
            return;
        }

        const index = current.findIndex(item => JSON.stringify(item) === JSON.stringify(newItem));

        if (index !== -1) {
            const updated = [...current];
            updated[index] = newItem;
            this.setNotifications(updated);
        } else {
            this.setNotifications([...current, newItem]);
        }
    }

    getActiveSessions(): Observable<any[]> {
        const token = localStorage.getItem('YXV0aFRva2Vu');
        return this.http.post<any[]>(`${environment.apiUrl}/api/System/UserSession/Filter`,
            {
                'filters': [],
                'sorts': [],
            },
            {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }),
            });
    }

    updateSession(data: any): Observable<any> {
        const token = localStorage.getItem('YXV0aFRva2Vu');
        return this.http.put<any>(`${environment.apiUrl}/api/System/UserSession/${data.id}`,
            data,
            {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }),
            });
    }

    connectToWebSocket(): void {
        const token = localStorage.getItem('YXV0aFRva2Vu');
        const apiUrl = environment.apiUrl.replace(/^https/, "wss");
        const url = `${apiUrl}/auth/WebsocketConnect?token=${token}&queueTag=sessionSocket`;
        this.socket = new WebSocket(url);

        this.socket.onopen = (): void => {
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (event): void => {
            try {
                const currentRole = this.jwtService.getDecodedToken().email;
                const data = JSON.parse(event.data);

                if (currentRole === 1) {
                    this.updateSessionProperty(data);
                } else {
                    switch (data.status) {
                        case 0: // Не определен
                            this.toastService.showError('Ошибка', data.message);
                            this.exitProfile();
                            break;
                        case 1: // Активна
                            this.toastService.showSuccess('Успешно', data.message);
                            break;
                        case 2: // В спящем режиме
                            this.toastService.showInfo('Внимание', data.message);
                            break;
                        case 3: // Приостановлена
                            this.toastService.showSuccess('Успешно', data.message);
                            break;
                        case 4: // Завершена
                            this.toastService.showSuccess('Успешно', data.message);
                            this.exitProfile();
                            break;
                        case 5: // Прервана (аварийно)
                            this.toastService.showSuccess('Успешно', data.message);
                            this.exitProfile();
                            break;
                        case 6: // Сессия заблокирована
                            this.toastService.showWarn('Внимание', data.message);
                            this.exitProfile();
                            break;
                        default:
                            console.error('Неизвестный статус:');
                    }
                }

                console.log('web-socket data:', data);
            } catch (e) {
                console.warn('Received non-JSON message:', event.data, e);
            }
        };

        this.socket.onerror = (error): void => {
            console.error('WebSocket error:', error);
            this.toastService.showError('Ошибка', 'Проблема с подключением WebSocket');
        };

        this.socket.onclose = (): void => {
            console.log('WebSocket disconnected');
        };
    }

    disconnectWebSocket(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }

    exitProfile() {
        this.router.navigate(['/']);
        this.tokenService.clearToken();
        window.history.pushState(null, '', '/');
        this.cacheService.clear();
    }
}