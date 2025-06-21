export const columns = [
    {
        header: 'Назначение',
        columns: [
            {
                field: 'productTarget.Id',
                fieldView: 'productTarget',
                filterType: 10,
                searchField: 'productTarget.Name',
                header: 'Назначение',
                type: 'uuid',
                visible: true,
                width: '15%',
                endpoint: '/api/Entities/ProductTarget/Filter'
            }
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'Вал',
        columns: [
            { field: 'grossCash', fieldView: 'grossCash', header: 'Нал', type: 'number', visible: true, width: '5%' },
            { field: 'grossNds', fieldView: 'grossNds', header: 'НДС', type: 'number', visible: true, width: '5%' },
            { field: 'grossNoNds', fieldView: 'grossNoNds', header: 'Без НДС', type: 'number', visible: true, width: '5%' }
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'Ремонт',
        columns: [
            { field: 'repairCashExpense', fieldView: 'repairCashExpense', header: 'Нал', type: 'number', visible: true, width: '5%' },
            { field: 'repairNdsExpense', fieldView: 'repairNdsExpense', header: 'НДС', type: 'number', visible: true, width: '5%' },
            { field: 'repairNoNdsExpense', fieldView: 'repairNoNdsExpense', header: 'Без НДС', type: 'number', visible: true, width: '5%' },
        ],
        visible: true,
        width: '15%' 
    },
    {
        header: 'Топливо',
        columns: [
            { field: 'fuelExpense', fieldView: 'fuelExpense', header: 'Топливо', type: 'number', visible: true, width: '12%' }
        ],
        visible: true,
        width: '12%'
    },
    {
        header: 'Гараж',
        columns: [
            { field: 'garageExpense', fieldView: 'garageExpense', header: 'Гараж', type: 'number', visible: true, width: '12%', isFilter: false }
        ],
        visible: true,
        width: '12%'
    },
    {
        header: 'Зарплаты',
        columns: [
            { field: 'driverSalary', fieldView: 'driverSalary', header: 'З/П водителя', type: 'number', visible: true, width: '13%' }
        ],
        visible: true,
        width: '13%'
    },
    {
        header: 'Итоги',
        columns: [
            { field: 'summary', fieldView: 'summary', header: 'Итого', type: 'number', visible: true, width: '12%' }
        ],
        visible: true,
        width: '12%'
    }
];

export const viewDataColumns = [
    {
        field: 'productTarget.Id',
        fieldView: 'productTarget',
        filterType: 10,
        searchField: 'productTarget.Name',
        header: 'Назначение',
        type: 'uuid',
        visible: true,
        width: '15%',
        endpoint: '/api/Entities/ProductTarget/Filter'
    },
    { field: 'grossCash', fieldView: 'grossCash', header: 'Нал', type: 'number', visible: true, width: '5%' },
    { field: 'grossNds', fieldView: 'grossNds', header: 'НДС', type: 'number', visible: true, width: '5%' },
    { field: 'grossNoNds', fieldView: 'grossNoNds', header: 'Без НДС', type: 'number', visible: true, width: '5%' },
    { field: 'repairCashExpense', fieldView: 'repairCashExpense', header: 'Нал', type: 'number', visible: true, width: '5%' },
    { field: 'repairNdsExpense', fieldView: 'repairNdsExpense', header: 'НДС', type: 'number', visible: true, width: '5%' },
    { field: 'repairNoNdsExpense', fieldView: 'repairNoNdsExpense', header: 'Без НДС', type: 'number', visible: true, width: '5%' },
    { field: 'fuelExpense', fieldView: 'fuelExpense', header: 'Топливо', type: 'number', visible: true, width: '12%' },
    { field: 'garageExpense', fieldView: 'garageExpense', header: 'Гараж', type: 'number', visible: true, width: '12%', isFilter: false },
    { field: 'driverSalary', fieldView: 'driverSalary', header: 'Водителя', type: 'number', visible: true, width: '13%' },
    { field: 'summary', fieldView: 'summary', header: 'Итого', type: 'number', visible: true, width: '12%' }
];

export const totalInfoColumn = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 2, value: 'totalExpenseSum' },
    { columnNum: 4, value: 'totalIncomeSum' },
];



