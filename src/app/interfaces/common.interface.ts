export enum ServiceType {
    Counterparty = 0, // Контрагент
    Service = 1, // Сервис
    Individual = 2, // Физическое лицо
    LegalEntity = 3 // Юридическое лицо
}

export interface Counterparty {
    fullName: string;
    shortName: string;
    inn: string;
    ogrn: string;
    kpp: string;
    address: string;
    isService: ServiceType;
    lastName: string;
    firstName: string;
    middleName: string;
}

export enum TaxType {
    WithoutVAT = 0, // Без НДС
    VAT5 = 1, // НДС 5%
    VAT20 = 2 // НДС 20%
}

export interface Product {
    productName: string;
    quantity: number;
    amount: number;
    tax: TaxType;
    date: Date;
}

export interface UserInstance {
    lastName: string;
    firstName: string;
    middleName: string;
}

export interface DocInvoice {
    date: Date;
    numberInvoice: string;
    status: string;
    checkPerson: string;
    stateNumberCar: string;
    incomeSum: number;
    expenseSum: number;
    type: TaxType;
    tax: number;
    productList: Product[];
}

export interface InvoiceField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'dropdown' | 'textarea' | 'number';
    placeholder: string;
    options: { label: string; value: any }[];
    optionLabel: string;
    optionValue: string;
    min: number;
    max: number;
    rowGroup?:string
    onChange?: (value: any, model: any) => void;
}

export interface InvoiceButton {
    label: string;
    icon?: string;
    action: (model: any, dependencies: any, close: any ) => void;
    disabled?: boolean;
}

export interface InvoiceConfig {
    fields: InvoiceField[];
    buttons: InvoiceButton[];
}