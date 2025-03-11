import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../environment';


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
  providedIn: 'root'
})
export class ProductsService {

  queryData: QueryDto = { filters: [], sorts: [] };
  constructor(private http: HttpClient) { }


  getProductsByCounterparty(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post<any>(`${environment.apiUrl}/api/CommercialWork/Product/ByPartner/${id}`, this.queryData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }




  onFilterChange(filter: FilterDto) {
    if (!this.queryData.filters) this.queryData.filters = [];
  
    // Удаляем все фильтры с тем же полем и типом из массива, если тип фильтра один из 6, 7, 8, 9
    if ([6, 7, 8, 9].includes(filter.type)) {
      this.queryData.filters = this.queryData.filters.filter(
        f => !(f.field === filter.field && [6, 7, 8, 9].includes(f.type))
      );
    }
  
     // Удаляем все фильтры с тем же полем и типом из массива, если тип фильтра один из 6, 7, 8, 9
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
    } else {
      this.queryData.filters.push(filter); // Добавляем новый фильтр
    }
    this.loadProducts()
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
  

  counterpartyId:any;
  products:any;

  loadProducts() {
    this.getProductsByCounterparty(this.counterpartyId).subscribe(
      (data) => {
        this.products = data.documentMetadata.data;
      },
      (error) => {
        console.error('Ошибка загрузки товаров:', error);
      }
    );
  }
}
