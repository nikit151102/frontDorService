export const CONFIGPRODUCTS: any = [
    {
        code: '184623',
        endpoint: 'api/CommercialWork/ManagerDocument/Remains',
        defaultFilter: {
            field: 'ManagerDocType',
            values: [0, 1],
            type: 1
        },
        columns: [
            { field: 'Cargo.Id', fieldView: 'cargoName', filterType: 10, searchField: 'Cargo.Name', header: 'Груз', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/Cargo/Filter' },
            { field: 'Weight', fieldView: 'weight', header: 'Тоннаж', type: 'string', visible: true, width: '18%' },
            { field: 'Amount', fieldView: 'amount', header: 'Цена', type: 'number', visible: true, width: '18%' },
            { field: 'SumAmount', fieldView: 'SumAmount', header: 'Сумма', type: 'number', visible: true, width: '18%' },
            { field: 'PaymentType', fieldView: 'paymentType', header: 'Цена', type: 'number', visible: true, width: '18%' },

        ],
        totalInfoColumn: [
            { columnNum: 2, value: 'totalExpenseSum' },
            { columnNum: 4, value: 'totalIncomeSum' },
            { columnNum: 7, value: 'totalSaldo' },
        ]
    },
    {
        code: '936564',
        defaultFilter: {
            field: 'ManagerDocType',
            values: [0, 1],
            type: 1
        },
        endpoint: 'api/CommercialWork/ManagerDocument/Providers',
        columns: [
            { field: 'Cargo.Id', fieldView: 'cargoName', filterType: 10, searchField: 'Cargo.Name', header: 'Груз', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/Cargo/Filter' },
            { field: 'Weight', fieldView: 'weight', header: 'Тоннаж', type: 'string', visible: true, width: '18%' },
            { field: 'Amount', fieldView: 'amount', header: 'Цена', type: 'number', visible: true, width: '18%' },
            { field: 'SumAmount', fieldView: 'SumAmount', header: 'Сумма', type: 'number', visible: true, width: '18%' },
            { field: 'PaymentType', fieldView: 'paymentType', header: 'Цена', type: 'number', visible: true, width: '18%' },
        ],
        totalInfoColumn: [
            { columnNum: 2, value: 'totalExpenseSum' },
            { columnNum: 4, value: 'totalIncomeSum' },
            { columnNum: 7, value: 'totalSaldo' },
        ]
    }
]