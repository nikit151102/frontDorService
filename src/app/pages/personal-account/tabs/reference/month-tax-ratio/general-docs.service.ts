import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../../environment';
import { InvoicesService } from '../../../components/invoices/invoices.service';

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
export class GeneralDocsService {


  queryData: QueryDto = { filters: [], sorts: [] };
  defaultFilters: FilterDto[] = [];
  filterStatic: any;
  constructor(private http: HttpClient, private router: Router) { }

  endpoint: string = '';
  endpointGetData: string | null = null;

  private dataSubject = new BehaviorSubject<any[]>([]);
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

  addOrUpdateItem(newItem: any) {
    const transformedItem = this.transformInvoice(newItem);

    const currentData = this.getActiveData();

    if (!Array.isArray(currentData)) {
      this.dataSubject.next([transformedItem]);
      return;
    }

    const filteredData = currentData.filter(item => {
      return item.id !== transformedItem.id;
    });

    const updatedData = [transformedItem, ...filteredData];

    this.dataSubject.next(updatedData);
  }

  private transformInvoice(invoice: any): any {
    const monthNames = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];

    let monthYear = '';

    if (invoice.dateTime) {
      const date = new Date(invoice.dateTime);
      if (!isNaN(date.getTime())) {
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        monthYear = `${month}`;
      }
    }

    return {
      ...invoice,
      expenseSum: invoice.expenseSum?.toString().replace('.', ','),
      incomeSum: invoice.incomeSum?.toString().replace('.', ','),
      monthYear: monthYear
    };
  }


  updateFieldById(id: any, field: string, value: any) {
    const currentData = this.getActiveData();

    if (Array.isArray(currentData)) {
      const updatedArray = currentData.map(item => {
        if (item.id === id && item.hasOwnProperty(field)) {
          return { ...item, [field]: value };
        }
        return item;
      });

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

    if (Array.isArray(currentData) && newItem.id) {
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


  getProductsByCounterparty(page: any = null, pageSize: any = null): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    this.queryData.filters = this.queryData.filters || [];

    console.log('this.defaultFilters[0]', this.defaultFilters)
    if (!this.queryData.filters.includes(this.defaultFilters[0])) {
      this.queryData.filters = [...this.defaultFilters, ...this.queryData.filters];
    }

    if (!this.queryData.sorts) {
      this.queryData.sorts = [];
    }

    const exists = this.queryData.sorts.some((sort) => sort.field === 'dateTime');

    if (!exists) {
      this.queryData.sorts.push({ field: 'dateTime', sortType: 1 });
    }

    console.log('page', page)
    if (page !== undefined && page !== null) {
      this.queryData.page = page;
    }

    if (pageSize !== undefined && pageSize !== null) {
      this.queryData.pageSize = pageSize;
    }

    let url
    if (this.endpointGetData) {
      url = `${environment.apiUrl}/${this.endpointGetData}`;
    }
    else {
      url = `${environment.apiUrl}/api/CommercialWork/MonthTaxRatio/Filter`;
    }
    return this.http.post<any>(url, this.queryData, {
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

    this.currentPage = 0;

    this.getProductsByCounterparty(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.products = data.documentMetadata.data;
      this.totalInfo = data.totalInfo;
      this.setActiveData(data.documentMetadata.data)
    })

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
  totalRecords = 0;
  totalPages = null;
  pageSize = 30;
  currentPage = 0;

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
function ViewChild(arg0: string): (target: InvoicesService, propertyKey: "tableContainer") => void {
  throw new Error('Function not implemented.');
}

