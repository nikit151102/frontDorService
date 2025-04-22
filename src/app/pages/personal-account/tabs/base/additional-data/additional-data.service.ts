import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../../environment';

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
export class AdditionalDataService {

  queryData: QueryDto = { filters: [], sorts: [] };
  constructor(private http: HttpClient, private router: Router) { }

  endpoint: string = '';

  defaultFilters: FilterDto[] = [];

  private dataSubject = new BehaviorSubject<any>(null);
  activData$ = this.dataSubject.asObservable();

  setActiveData(tab: any) {
    this.dataSubject.next(tab);
  }
  getActiveData(tab: any) {
    this.dataSubject.value;
  }



  getProductsByCounterparty(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    this.queryData.filters = this.queryData.filters || [];

    const currentUrl = this.router.url;

    const typeValue = currentUrl.includes('/services')
    ? 1
    : currentUrl.includes('/projects')
      ? 5
      : 0;
  
      const hasAccountTypeFilter = this.queryData.filters.some(
        (filter: any) => filter.field === 'DocInvoice.DocAccountType'
      );
      
      if (!hasAccountTypeFilter) {
        this.queryData.filters.push({
          field: 'DocInvoice.DocAccountType',
          values: [0],
          type: 1,
        });
      }

    let defaultFilter = {
      field: 'DocInvoice.Partner.Type',
      values: [typeValue],
      type: 1
    }

    
    const filterExists = this.queryData.filters.some(filter =>
      filter.field === defaultFilter.field &&
      JSON.stringify(filter.values) === JSON.stringify(defaultFilter.values) &&
      filter.type === defaultFilter.type
    );

    if (!filterExists) {
      this.queryData.filters.push(defaultFilter);
    }

    if (!this.queryData.sorts) {
      this.queryData.sorts = [];
    }

    const exists = this.queryData.sorts.some((sort) => sort.field === 'DocInvoice.DateTime');

    if (!exists) {
      this.queryData.sorts.push({ field: 'DocInvoice.DateTime', sortType: 0 });
    }


    const existsDocPaymentType = this.queryData.filters.some((sort) => sort.field === 'DocInvoice.DocPaymentType');

    if (!existsDocPaymentType) {
      this.queryData.filters.push({ field: 'DocInvoice.DocPaymentType', values:[0], type: 1 });
    }


    return this.http.post<any>(`${environment.apiUrl}/${this.endpoint}`, this.queryData, {
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

    // Удаляем фильтр, если values стал пустым массивом или `[""]`
    this.queryData.filters = this.queryData.filters.filter(f => f.values && f.values.length > 0 && f.values[0] !== "");
    
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


  counterpartyId: any;
  products: any;
  totalInfo: any;

  loadProducts() {
    this.getProductsByCounterparty(this.counterpartyId).subscribe(
      (data) => {
        this.products = data.documentMetadata.data.map((invoice:any) => ({
          ...invoice,
          sumAmount: invoice.sumAmount.toString().replace('.', ','),
        }));
        this.totalInfo = data.totalInfo;
      },
      (error) => {
        console.error('Ошибка загрузки товаров:', error);
      }
    );
  }
}
