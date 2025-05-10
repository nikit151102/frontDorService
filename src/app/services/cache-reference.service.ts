import { Injectable } from '@angular/core';

@Injectable()
export class CacheReferenceService {
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