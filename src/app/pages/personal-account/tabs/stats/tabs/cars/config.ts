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
                width: '10%',
                endpoint: '/api/Entities/ProductTarget/Filter'
            },
        ],
        visible: true,
        width: '10%'
    },
    {
        header: 'Вал',
        columns: [
            { field: 'daysCount', fieldView: 'daysCount', header: 'Дни', type: 'number', visible: true, width: '5%' },
            { field: 'odometerSumKm', fieldView: 'odometerSumKm', header: 'Км', type: 'number', visible: true, width: '5%' },
            { field: 'grossSum', fieldView: 'grossSum', header: 'Вал', type: 'number', visible: true, width: '5%' },
            { field: 'kmCost', fieldView: 'kmCost', header: 'Вал км', type: 'number', visible: true, width: '5%' },
            { field: 'repairExpense', fieldView: 'repairExpense', header: 'Ремонты', type: 'number', visible: true, width: '5%' },
            { field: 'fuelExpense', fieldView: 'fuelExpense', header: 'Топливо', type: 'number', visible: true, width: '12%' },
            { field: 'fuelCost', fieldView: 'fuelCost', header: 'Цена', type: 'number', visible: true, width: '12%' },
            { field: 'fuelCostPerKm', fieldView: 'fuelCostPerKm', header: 'Цена км', type: 'number', visible: true, width: '12%' },
            { field: 'garageExpense', fieldView: 'garageExpense', header: 'Гараж', type: 'number', visible: true, width: '10%' },
            { field: 'officeSalary', fieldView: 'officeSalary', header: 'ЗП офис', type: 'number', visible: true, width: '10%' },
            { field: 'driverSalary', fieldView: 'driverSalary', header: 'ЗП водители', type: 'number', visible: true, width: '10%' },
            { field: 'taxSum', fieldView: 'taxSum', header: 'Налоги', type: 'number', visible: true, width: '5%' },
            { field: 'summaryTaxNotInclude', fieldView: 'summaryTaxNotInclude', header: 'Итог', type: 'number', visible: true, width: '10%' },
            { field: 'summary', fieldView: 'summary', header: 'Итог коэффициент', type: 'number', visible: true, width: '10%' },
        ],
        visible: true,
        width: '10%'
    },
    // {
    //     header: 'Ремонт',
    //     columns: [
    //         { field: 'repairCashExpense', fieldView: 'repairCashExpense', header: 'Нал', type: 'number', visible: true, width: '5%' },
    //         { field: 'repairNdsExpense', fieldView: 'repairNdsExpense', header: 'НДС', type: 'number', visible: true, width: '5%' },
    //         { field: 'repairNoNdsExpense', fieldView: 'repairNoNdsExpense', header: 'Без НДС', type: 'number', visible: true, width: '5%' },
    //     ],
    //     visible: true,
    //     width: '15%'
    // },
    // {
    //     header: 'Топливо',
    //     columns: [
    //         { field: 'fuelExpense', fieldView: 'fuelExpense', header: 'Топливо', type: 'number', visible: true, width: '12%' }
    //     ],
    //     visible: true,
    //     width: '12%'
    // },
    // {
    //     header: 'Гараж',
    //     columns: [
    //         { field: 'garageExpense', fieldView: 'garageExpense', header: 'Гараж', type: 'number', visible: true, width: '12%', isFilter: false }
    //     ],
    //     visible: true,
    //     width: '12%'
    // },
    // {
    //     header: 'Зарплаты',
    //     columns: [
    //         { field: 'officeSalary', fieldView: 'officeSalary', header: 'З/П офис', type: 'number', visible: true, width: '13%' },
    //         { field: 'driverSalary', fieldView: 'driverSalary', header: 'З/П водителя', type: 'number', visible: true, width: '13%' }
    //     ],
    //     visible: true,
    //     width: '13%'
    // },
    // {
    //     header: 'Итоги',
    //     columns: [
    //         { field: 'summary', fieldView: 'summary', header: 'Итого', type: 'number', visible: true, width: '12%' }
    //     ],
    //     visible: true,
    //     width: '12%'
    // }
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
    { field: 'daysCount', fieldView: 'daysCount', header: 'Дни', type: 'number', visible: true, width: '5%' },
    { field: 'odometerSumKm', fieldView: 'odometerSumKm', header: 'Км', type: 'number', visible: true, width: '5%' },
    { field: 'grossSum', fieldView: 'grossSum', header: 'Вал', type: 'number', visible: true, width: '5%' },
    { field: 'kmCost', fieldView: 'kmCost', header: 'Вал км', type: 'number', visible: true, width: '5%' },
    { field: 'repairExpense', fieldView: 'repairExpense', header: 'Ремонты', type: 'number', visible: true, width: '5%' },
    { field: 'fuelExpense', fieldView: 'fuelExpense', header: 'Топливо', type: 'number', visible: true, width: '12%' },
    { field: 'fuelCost', fieldView: 'fuelCost', header: 'Цена', type: 'number', visible: true, width: '12%' },
    { field: 'fuelCostPerKm', fieldView: 'fuelCostPerKm', header: 'Цена км', type: 'number', visible: true, width: '12%' },
    { field: 'garageExpense', fieldView: 'garageExpense', header: 'Гараж', type: 'number', visible: true, width: '10%' },
    { field: 'officeSalary', fieldView: 'officeSalary', header: 'ЗП офис', type: 'number', visible: true, width: '10%' },
    { field: 'driverSalary', fieldView: 'driverSalary', header: 'ЗП водители', type: 'number', visible: true, width: '10%' },
    { field: 'taxSum', fieldView: 'taxSum', header: 'Налоги', type: 'number', visible: true, width: '5%' },
    { field: 'summaryTaxNotInclude', fieldView: 'summaryTaxNotInclude', header: 'Итог', type: 'number', visible: true, width: '10%' },
    { field: 'summary', fieldView: 'summary', header: 'Итог коэффициент', type: 'number', visible: true, width: '10%' },
];

export const totalInfoColumn = [
    { columnNum: 0, value: 'statisticsName' },
    { columnNum: 1, value: 'totalDaysCount' },
    { columnNum: 2, value: 'totalOdometerSum' },
    { columnNum: 3, value: 'grossTotalSum' },
    { columnNum: 4, value: 'kmCostTotalSum' },
    { columnNum: 5, value: 'repairExpense' },
    { columnNum: 6, value: 'fuelExpenseTotalSum' },
    { columnNum: 7, value: 'fuelCostTotalSum' },
    { columnNum: 8, value: 'fuelCostPerKmTotalSum' },
    { columnNum: 9, value: 'garageExpenseTotalSum' },
    { columnNum: 10, value: 'officeSalaryTotalSum' },
    { columnNum: 11, value: 'driverSalaryTotalSum' },
    { columnNum: 12, value: 'taxTotalSum' },
    { columnNum: 13, value: 'summaryTotalSum' },
    { columnNum: 14, value: 'summaryTaxNotIncludeTotalSum' }
];

export const oldTotalInfoColumn = [
    { columnNum: 0, value: 'statisticsName' },
    { columnNum: 1, value: 'totalDaysCount' },
    { columnNum: 2, value: 'totalOdometerSum' },
    { columnNum: 3, value: 'grossTotalSum' },
    { columnNum: 4, value: 'kmCostTotalSum' },
    { columnNum: 5, value: 'repairExpense' },
    { columnNum: 6, value: 'fuelExpenseTotalSum' },
    { columnNum: 7, value: 'fuelCostTotalSum' },
    { columnNum: 8, value: 'fuelCostPerKmTotalSum' },
    { columnNum: 9, value: 'garageExpenseTotalSum' },
    { columnNum: 10, value: 'officeSalaryTotalSum' },
    { columnNum: 11, value: 'driverSalaryTotalSum' },
    { columnNum: 12, value: 'taxTotalSum' },
    { columnNum: 13, value: 'summaryTotalSum' },
    { columnNum: 14, value: 'summaryTaxNotIncludeTotalSum' }

];
