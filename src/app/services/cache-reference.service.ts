import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from './toast.service';

@Injectable()
export class CacheReferenceService {

  constructor(private http: HttpClient,
    private toastService: ToastService) { }

  private readonly CACHE_PREFIX = 'app_cache_';
  private readonly LOADING_PREFIX = 'app_loading_';

  // Получение данных из кэша
  get(endpoint: string): any {
    const cacheKey = this.getCacheKey(endpoint);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    try {
      const { data, expiry } = JSON.parse(cached);

      // Проверяем срок действия
      if (expiry && expiry < Date.now()) {
        this.clear(endpoint);
        return null;
      }

      return data;
    } catch (e) {
      this.clear(endpoint);
      return null;
    }
  }

  // Сохранение в кэш
  set(endpoint: string, data: any, ttl: number = 5 * 60 * 1000): void {
    const cacheItem = {
      data: data,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(this.getCacheKey(endpoint), JSON.stringify(cacheItem));
  }

  // Проверка состояния загрузки
  isLoading(endpoint: string): boolean {
    const loadingKey = this.getLoadingKey(endpoint);
    return localStorage.getItem(loadingKey) === 'true';
  }

  // Установка состояния загрузки
  setLoading(endpoint: string, state: boolean): void {
    const loadingKey = this.getLoadingKey(endpoint);
    localStorage.setItem(loadingKey, String(state));
  }

  // Очистка кэша
  clear(endpoint?: string): void {
    if (endpoint) {
      localStorage.removeItem(this.getCacheKey(endpoint));
      localStorage.removeItem(this.getLoadingKey(endpoint));
    } else {
      this.clearAllCache();
    }
  }

  getAllCachedEndpoints(): string[] {
    const endpoints = new Set<string>();

    Object.keys(localStorage)
      .filter(key => key.startsWith(this.CACHE_PREFIX))
      .forEach(key => {
        try {
          const endpoint = decodeURIComponent(key.substring(this.CACHE_PREFIX.length));
          if (endpoint && endpoint.trim() !== '') {
            endpoints.add(endpoint);
          }
        } catch (e) {
          console.error(`Ошибка декодирования ключа кэша: ${key}`, e);
        }
      });

    return Array.from(endpoints).filter(endpoint => endpoint);
  }


  private getProductsByEndpoint(endpoint: string): Observable<any[]> {
    const cached = this.get(endpoint);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    const token = localStorage.getItem('YXV0aFRva2Vu');
    return new Observable(observer => {
      this.http.post<any[]>(`${environment.apiUrl}${endpoint}`, { filters: [], sorts: [] }, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      }).subscribe(
        (response: any) => {
          const data = response.data;
          this.set(endpoint, data);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
  refreshAllCachedData(): Observable<any[]> {
    const endpoints = this.getAllCachedEndpoints();
    if (endpoints.length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return new Observable(observer => {
      const results: any[] = [];
      let completed = 0;

      endpoints.forEach(endpoint => {
        this.clear(endpoint);

        this.setLoading(endpoint, true);

        this.getProductsByEndpoint(endpoint).subscribe({
          next: (data) => {
            results.push({ endpoint, data, status: 'success' });
            completed++;
            this.setLoading(endpoint, false);
            checkCompletion();
          },
          error: (err) => {
            console.error(`Ошибка обновления данных для ${endpoint}:`, err);
            results.push({ endpoint, error: err.message, status: 'error' });
            completed++;
            this.setLoading(endpoint, false);
            checkCompletion();
          }
        });
      });

      const checkCompletion = () => {
        if (completed === endpoints.length) {
          observer.next(results);
          observer.complete();
        }
      };
    });
  }
  private clearAllCache(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX) || key.startsWith(this.LOADING_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  private getCacheKey(endpoint: string): string {
    return `${this.CACHE_PREFIX}${encodeURIComponent(endpoint)}`;
  }

  private getLoadingKey(endpoint: string): string {
    return `${this.LOADING_PREFIX}${encodeURIComponent(endpoint)}`;
  }
}