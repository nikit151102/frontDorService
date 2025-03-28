import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environment';

interface FilterDto {
  field?: string;
  values?: any[]; // Используем `any`, так как тип данных может варьироваться
  type?: any; // 0 - string, 1 - int, 2 - DateTime, 3 - Guid
}

interface SortDto {
  field?: string;
  sortType: number; // 0 - прямой, 1 - обратный
}

interface QueryDto {
  filters?: FilterDto[];
  sorts?: SortDto[];
}



@Injectable({
  providedIn: 'any'
})

export class InvoicesService {

  queryData: QueryDto = { filters: [], sorts: [] };
  defaultFilters: FilterDto[] = [];
  constructor(private http: HttpClient) { }

  endpoint: string = '';


  private dataSubject = new BehaviorSubject<any>(null);
  activData$ = this.dataSubject.asObservable();

  setActiveData(tab: any) {
    this.dataSubject.next(tab);
  }

  getActiveData() {
    return this.dataSubject.value;
  }

  addItemToStart(newItem: any) {
    const currentData = this.getActiveData();
    this.dataSubject.next([newItem, ...currentData]);
  }

  updateActiveData(updatedData: any) {
    const currentData = this.getActiveData();

    if (Array.isArray(currentData)) {

      const updatedArray = currentData.map(item =>
        item.id === updatedData.id ? { ...item, ...updatedData } : item
      );

      this.dataSubject.next(updatedArray);
    }
  }

  removeItemById(id: any) {
    const currentData = this.getActiveData();

    if (Array.isArray(currentData)) {
      const filteredArray = currentData.filter(item => item.id !== id);
      this.dataSubject.next(filteredArray);
    }
  }

  updateOrAddItem(newItem: any) {
    const currentData = this.getActiveData();
  
    if (Array.isArray(currentData)) {
      const index = currentData.findIndex(item => item.id === newItem.id);
  
      if (index !== -1) {
        // Если объект найден, обновляем его
        currentData[index] = { ...currentData[index], ...newItem };
      } else {
        // Если объект не найден, добавляем в начало
        currentData.unshift(newItem);
      }
  
      this.dataSubject.next([...currentData]);
    }
  }

  

  getProductsByCounterparty(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    this.queryData.filters = this.queryData.filters || [];

    if (!this.queryData.filters.includes(this.defaultFilters[0])) {
      this.queryData.filters = [...this.defaultFilters, ...this.queryData.filters];
    }


    return this.http.post<any>(`${environment.apiUrl}/${this.endpoint}/${id}`, this.queryData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }


  onFilterChange(filter: FilterDto) {
    if (!this.queryData.filters) this.queryData.filters = [];

    // Проверка на пустые значения для фильтра с типами 6, 7, 8, 9
    if ([6, 7, 8, 9].includes(filter.type) && (filter.values && filter.values[0] === "")) {
      // Если значения пустые, не добавляем фильтр
      this.queryData.filters = this.queryData.filters.filter(
        f => !(f.field === filter.field && [6, 7, 8, 9].includes(f.type))
      );
      this.loadProducts();
      console.log('Обновленные фильтры:', this.queryData.filters);
      return; // Выходим из метода, чтобы не продолжать добавление фильтра
    }

    // Удаляем все фильтры с тем же полем и типом из массива, если тип фильтра один из 6, 7, 8, 9
    if ([6, 7, 8, 9].includes(filter.type)) {
      this.queryData.filters = this.queryData.filters.filter(
        f => !(f.field === filter.field && [6, 7, 8, 9].includes(f.type))
      );
    }

    // Удаляем все фильтры с тем же полем и типом из массива, если тип фильтра один из 2, 3, 4, 5
    if ([2, 3, 4, 5].includes(filter.type)) {
      this.queryData.filters = this.queryData.filters.filter(
        f => !(f.field === filter.field && [2, 3, 4, 5].includes(f.type))
      );
    }

    // Добавляем или обновляем фильтр
    const existingFilter = this.queryData.filters.find(
      f => f.field === filter.field && f.type === filter.type
    );

    if (existingFilter) {
      existingFilter.values = filter.values; // Обновляем значения
    } else if (filter.values && filter.values[0] !== "") {
      // Добавляем фильтр только если значения не пустые
      this.queryData.filters.push(filter);
    }

    // Удаляем фильтр, если values стал пустым массивом или `[""]`
    this.queryData.filters = this.queryData.filters.filter(f => f.values && f.values.length > 0 && f.values[0] !== "");


    this.loadProducts();
    console.log('Обновленные фильтры:', this.queryData.filters);
  }




  onSortChange(sort: SortDto) {
    if (!this.queryData.sorts) this.queryData.sorts = [];

    const existingSort = this.queryData.sorts.find(s => s.field === sort.field);

    if (existingSort) {
      existingSort.sortType = sort.sortType; // Обновляем тип сортировки
    } else {
      this.queryData.sorts.push(sort); // Добавляем новую сортировку
    }
    this.loadProducts();
    console.log('Обновленные сортировки:', this.queryData.sorts);
    console.log('Обновленные данные:', this.queryData);
  }


  counterpartyId: any;
  products: any;
  totalInfo: any;

  loadProducts() {
    this.getProductsByCounterparty(this.counterpartyId).subscribe(
      (data) => {
        this.products = data.documentMetadata.data;
        this.totalInfo = data.totalInfo;
        this.setActiveData(data.documentMetadata.data)
      },
      (error) => {
        console.error('Ошибка загрузки товаров:', error);
      }
    );
  }


}
