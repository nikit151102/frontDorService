import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { InvoicesService } from '../base/invoices/invoices.service';

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
  page?: any;
  pageSize?: any
}


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  queryData: QueryDto = { filters: [], sorts: [] };
  constructor(private http: HttpClient, private router: Router, private invoicesService:InvoicesService) { }

  endpoint: string = 'api/CommercialWork/DocInvoice/WarehouseDebit';

  defaultFilters: FilterDto[] = [];

  private dataSubject = new BehaviorSubject<any>(null);
  activData$ = this.dataSubject.asObservable();

  setActiveData(tab: any) {
    this.dataSubject.next(tab);
  }
  getActiveData(tab: any) {
    this.dataSubject.value;
  }



  getProductsByCounterparty(id: string, page: any = null, pageSize: any = null): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    this.queryData.filters = this.queryData.filters || [];


    let defaultFilter: any;


    // const filterExists = this.queryData.filters.some(filter =>
    //   filter.field === defaultFilter.field &&
    //   JSON.stringify(filter.values) === JSON.stringify(defaultFilter.values) &&
    //   filter.type === defaultFilter.type
    // );

    // if (!filterExists) {
    //   this.queryData.filters.push(defaultFilter);
    // }

    if (!this.queryData.sorts) {
      this.queryData.sorts = [];
    }

    if (page !== undefined && page !== null) {
      this.queryData.page = page;
    }

    if (pageSize !== undefined && pageSize !== null) {
      this.queryData.pageSize = pageSize;
    }


    return this.http.post<any>(`${environment.apiUrl}/api/CommercialWork/Product/Filter/00000000-0000-0000-0000-000000000000`, this.queryData, {
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
    this.currentPage = 0;
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
    this.currentPage = 0;
    this.loadProducts();
    console.log('Обновленные сортировки:', this.queryData.sorts);
    console.log('Обновленные данные:', this.queryData);
  }


  counterpartyId: any;
  products: any;
  totalInfo: any;

  loading = false;
  totalRecords = 0;
  totalPages = null;
  pageSize = 30;
  currentPage = 0;

  loadProducts() {
    this.getProductsByCounterparty(this.counterpartyId).subscribe(
      (data) => {
        this.products = data.documentMetadata.data.map((invoice: any) => ({
          ...invoice,
          sumAmount: invoice.sumAmount.toString().replace('.', ','),
        }));
        this.totalInfo = data.totalInfo;
        this.invoicesService.totalInfo = data.totalInfo;
        console.log('this.invoicesService.totalInfo',this.invoicesService.totalInfo)
        console.log('data', data)
        console.log('products', this.products)
      },
      (error) => {
        console.error('Ошибка загрузки товаров:', error);
      }
    );
  }
}
