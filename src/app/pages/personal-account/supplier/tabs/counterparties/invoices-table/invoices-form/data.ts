
export const columns = [
    { field: 'number', header: 'Номер' },
    { field: 'expenseSum', header: 'Расход' },
    { field: 'incomeSum', header: 'Приход' },
    { field: 'dateTime', header: 'Дата' }
];

export const statuses = [
    { label: 'Не отправлено', value: 0, id: 0},
    { label: 'Проверка Механик', value: 1, id: 1 }, // голубой
    { label: 'Проверка Директор', value: 2, id: 2 }, // голубой
    { label: 'Отклонено Механик', value: 3, id: 3 }, // красный
    { label: 'Отклонено Директор', value: 4, id: 4 }, // красный
    { label: 'Подписано', value: 5, id: 5 }, // зеленый
    { label: 'Удалено', value: 6, id: 6 } // серый
];


export const taxes = [
    { label: 'Без НДС', value: 0 },
    { label: 'НДС 5%', value: 1 },
    { label: 'НДС 20%', value: 2 }
];


export const adjustmentOptions = [
    { label: '+', value: 1 },
    { label: '-', value: 2 }
];

export const types = [
    { label: 'Расход', value: 1 },
    { label: 'Коррекция', value: 0 }
];



export const productColumns = [
    { header: 'Покупка', field: 'incomeSum' },
    { header: 'Оплата', field: 'expenseSum' },
    { header: 'Дата', field: 'dateTime' },
    { header: 'Номер', field: 'number' }
  ];