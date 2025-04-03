import { InvoiceConfig } from "../../../../../interfaces/common.interface";

export const FORM_SETS: InvoiceConfig = {
    fields: [
        {
            name: 'dateTime',
            label: 'Дата',
            type: 'date',
            placeholder: 'Выберите дату',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
        {
            name: 'productTarget.Id',
            label: 'Назначение',
            type: 'dropdown',
            placeholder: 'Выберите назначение',
            options: [],
            optionLabel: 'productTarget.Name',
            optionValue: 'productTarget.Id',
            min: 0,
            max: 0,
        },
        {
            name: 'number',
            label: 'Номер',
            type: 'text',
            placeholder: 'Введите номер',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
        {
            name: 'expenseSum',
            label: 'Расход',
            type: 'text',
            placeholder: 'Введите расход',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
        {
            name: 'incomeSum',
            label: 'Приход',
            type: 'text',
            placeholder: 'Введите приход',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
        {
            name: 'status',
            label: 'Статус',
            type: 'dropdown',
            placeholder: 'Выберите статус',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
    ],
    buttons: [
        {
            label: 'Сохранить',
            action: (model: any) => {

            },
        },
        {
            label: 'Отменить',
            action: (model: any) => {

            },
        },
    ],
};



export const MODEL = {
    dateTime: '',
    productTargetId: '', 
    number: '',  
    expenseSum: '',  
    incomeSum: '',  
    status: '',  
  };
  