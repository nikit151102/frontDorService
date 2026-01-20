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
            },
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'ЗП',
        columns: [
            { field: 'officeSalary', fieldView: 'officeSalary', header: 'ЗП', type: 'number', visible: true, width: '15%' },
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'Затраты',
        columns: [
            { field: 'repairCashExpense', fieldView: 'repairCashExpense', header: 'Нал', type: 'number', visible: true, width: '15%' },
            { field: 'repairNdsExpense', fieldView: 'repairNdsExpense', header: 'Без Нал', type: 'number', visible: true, width: '15%' },
            { field: 'repairNoNdsExpense', fieldView: 'repairNoNdsExpense', header: 'Без НДС', type: 'number', visible: true, width: '15%' },
            { field: 'repairExpense', fieldView: 'repairExpense', header: 'Сумма', type: 'number', visible: true, width: '15%' },

        ],
        visible: true,
        width: '60%'
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
        width: '10%',
        endpoint: '/api/Entities/ProductTarget/Filter'
    },
    { field: 'officeSalary', fieldView: 'officeSalary', header: 'ЗП', type: 'number', visible: true, width: '15%' },
    { field: 'repairCashExpense', fieldView: 'repairCashExpense', header: 'Нал', type: 'number', visible: true, width: '15%' },
    { field: 'repairNdsExpense', fieldView: 'repairNdsExpense', header: 'Без Нал', type: 'number', visible: true, width: '15%' },
    { field: 'repairNoNdsExpense', fieldView: 'repairNoNdsExpense', header: 'Без НДС', type: 'number', visible: true, width: '15%' },
    { field: 'repairExpense', fieldView: 'repairExpense', header: 'Сумма', type: 'number', visible: true, width: '15%' },];


export const totalInfoColumn = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 1, value: 'officeSalaryTotalSum' },
    { columnNum: 2, value: 'repairCashExpenseTotalSum' },
    { columnNum: 3, value: 'repairNdsExpenseTotalSum' },
    { columnNum: 4, value: 'repairNoNdsExpenseTotalSum' },
    { columnNum: 5, value: 'summaryTotalSum' },
];

export const oldTotalInfoColumn = [

];
