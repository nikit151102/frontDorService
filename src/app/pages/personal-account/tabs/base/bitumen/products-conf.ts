export const CONFIGPRODUCTS: any = [
    {
        code: '184623',
        endpoint: 'api/CommercialWork/ManagerDocument/Filter',
        columns: [
            { field: 'productTarget.Id', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
            { field: 'name', fieldView: 'name', header: 'Товар', type: 'string', visible: true, width: '17%' },
            { field: 'quantity', fieldView: 'quantity', header: 'Количество', type: 'number', visible: true, width: '11%' },
            { field: 'measurementUnit.Id', fieldView: 'measurementUnit', filterType: 10, searchType: 'measurementUnit.Name', header: 'Ед.изм', type: 'uuid', visible: true, width: '11%', endpoint: '/api/Entities/MeasurementUnit/Filter' },
            { field: 'sumAmount', fieldView: 'sumAmount', header: 'Общая сумма', type: 'number', visible: true, width: '11%' },
            { field: 'DocInvoice.Number', fieldView: 'docInvoice', header: 'Номер фактуры', type: 'string', visible: true, width: '10%', isFilter: false },
            { field: 'DocInvoice.DateTime', fieldView: 'dateTime', header: 'Дата фактуры', type: 'date', visible: true, width: '13%' },
            { field: 'DocInvoice.Status', fieldView: 'docInvoiceStatus', header: 'Статус фактуры', type: 'enam', visible: true, width: '16%' },
            { field: 'DocInvoice.CreatorName', fieldView: 'creatorName', header: 'Создатель', type: 'string', visible: true, width: '16%' },

        ],
        totalInfoColumn: [
            { columnNum: 2, value: 'totalExpenseSum' },
            { columnNum: 4, value: 'totalIncomeSum' },
            { columnNum: 7, value: 'totalSaldo' },
        ]
    },
    {
        code: '936564',
        endpoint: '',
        columns: [
            { field: 'productTarget.Id', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
            { field: 'name', fieldView: 'name', header: 'Товар', type: 'string', visible: true, width: '17%' },
            { field: 'quantity', fieldView: 'quantity', header: 'Количество', type: 'number', visible: true, width: '11%' },

        ],
        totalInfoColumn: [
            { columnNum: 2, value: 'totalExpenseSum' },
            { columnNum: 4, value: 'totalIncomeSum' },
            { columnNum: 7, value: 'totalSaldo' },
        ]
    }
]