export const columns = [
    { field: 'productTarget.Id', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'grossSum', fieldView: 'grossSum', header: 'Вал сумма', type: 'number', visible: true, width: '17%' },
    { field: 'repairExpense', fieldView: 'repairExpense', header: 'Ремонт', type: 'string', visible: true, width: '11%' },
    { field: 'fuelExpense', fieldView: 'fuelExpense', header: 'Топливо', type: 'number', visible: true, width: '11%' },
    { field: 'garageExpense', fieldView: 'garageExpense', header: 'Гараж', type: 'number', visible: true, width: '10%', isFilter: false },
    { field: 'driverSalary', fieldView: 'driverSalary', header: 'З/П водителя', type: 'number', visible: true, width: '13%' },
    { field: 'officeSalary', fieldView: 'officeSalary', header: 'З/П Офис', type: 'number', visible: true, width: '16%' },
    { field: 'summary', fieldView: 'summary', header: 'Итого', type: 'number', visible: true, width: '16%' },

];


export const totalInfoColumn = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 2, value: 'totalExpenseSum' },
    { columnNum: 4, value: 'totalIncomeSum' },
];