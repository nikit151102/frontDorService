export const referenceConfig = [
    {
        typeId: '194253',
        endpoints: {
            getAllItems: '',
            getByIdItem: '',
            createItem: '',
            updateItem: '',
            deleteItem: '',
        },
        pageTitle: 'Контрагенты',
        tableColumns: [
            { label: 'Покупка', field: 'income' },
            { label: 'Оплата', field: 'expense' },
            { label: 'Дата', field: 'date' },
            { label: 'Номер счет-фактуры', field: 'numberInvoice' },
        ],
        columnBottomFix: [
            { columnIndex: 1, variable: 'commonIncome' },
            { columnIndex: 2, variable: 'commonExpense' }
        ],
        formFields: [
            { label: 'Гос номер автомобиля', field: 'stateNumberCar', type: 'text' },
            { label: 'Дата', field: 'date', type: 'date' },
            { label: 'Номер счет-фактуры', field: 'numberInvoice', type: 'text' },
            {
                label: 'Статус', field: 'status', type: 'enam',
                values: [
                    { name: '', code: 0 },
                    { name: '', code: 1 },
                    { name: '', code: 2 },
                ]
            },
            {
                label: 'Список товаров', field: 'name', type: 'table',
                item: [
                    { label: 'Наименование товара', field: 'productName', type: 'text' },
                    { label: 'Количество', field: 'quantity', type: 'text' },
                    { label: 'Сумма', field: 'amount', type: 'number' },
                    { label: 'Дата', field: 'date', type: 'date' },
                ]
            },
            // { label: 'Приход', field: 'name', type: 'text' },
            // { label: 'Расход', field: 'name', type: 'text' },
            {
                label: 'Налог', field: 'tax', type: 'enam',
                values: [
                    { name: 'Без НДС', code: 0 },
                    { name: 'НДС 5%', code: 1 },
                    { name: 'НДС 20%', code: 1 },
                ]
            },
            // { label: 'Тип', field: 'name', type: 'text' },
        ],
    },

]

