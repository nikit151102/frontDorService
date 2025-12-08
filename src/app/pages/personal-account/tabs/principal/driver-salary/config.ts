export const columnsDocs = [
    // { field: 'DateTime', fieldView: 'year', header: 'Год', type: 'date', visible: true, width: '25%' },
    // { field: 'DateTime', fieldView: 'month', header: 'Месяц', type: 'date', visible: true, width: '25%' },
    { field: 'DateTime', fieldView: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '30%' },
    { field: 'driverName', fieldView: 'driverName', filterType: 10, searchField: 'productTarget.Name', header: 'Сотрудник', type: 'uuid', visible: true, width: '30%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'Amount', fieldView: 'expenseSum', header: 'Сумма', type: 'number', visible: true, width: '30%' },
];

export const columnsEmployee = [
    // { field: 'DateTime', fieldView: 'year', header: 'Год', type: 'date', visible: true, width: '25%' },
    // { field: 'DateTime', fieldView: 'month', header: 'Месяц', type: 'date', visible: true, width: '25%' },
    { field: 'DateTime', fieldView: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '25%' },
    { field: 'productTargetName', fieldView: 'productTarget', filterType: 10, searchField: 'productTargetName', header: 'Машина', type: 'uuid', visible: true, width: '25%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'driverName', fieldView: 'driverName', filterType: 10, searchField: 'driverName', header: 'Водитель', type: 'uuid', visible: true, width: '25%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'Amount', fieldView: 'expenseSum', header: 'Сумма', type: 'number', visible: true, width: '25%' },
];

export const columnsTax = [
    { field: 'DateTime', fieldView: 'year', header: 'Год', type: 'date', visible: true, width: '30%' },
    { field: 'DateTime', fieldView: 'month', header: 'Месяц', type: 'date', visible: true, width: '30%' },
    { field: 'Amount', fieldView: 'expenseSum', header: 'Сумма', type: 'number', visible: true, width: '30%' },
];

export const employeeType = 1

export interface ButtonConfig {
    label: string;
    action: string;
    titlePopUp?: string;
    messagePopUp?: string;
    status?: number;
    class: string;
    isEditData?: boolean;
    condition?: (product: any, idCurrentUser: any) => boolean;
}

export const BUTTON_SETS: Record<string, ButtonConfig[]> = {
    logistic: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product, idCurrentUser) => product.status,
        },
        {
            label: 'Отправить на проверку',
            action: 'sendingInvoice',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию в этой фактуре?',
            isEditData: true,
            condition: (product, idCurrentUser) => product.status == 1,
        },
    ],
    director: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product, idCurrentUser) => true,
        },
        {
            label: 'Удалить',
            action: 'deleteInvoice',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить фактуру?',
            condition: (product, idCurrentUser) => product.status,
        },
    ],
    default: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product, idCurrentUser) => product.status !== 0 && product.status !== 3,
        }
    ]
};



export const CONFIGS = [
    {
        code: '349246',
        endpoint: '/api/CommercialWork/DocInvoice/DocDirector/Filter',
        employeeType: 2,
        totalInfoColumn: [
            { columnNum: 0, value: 'totalCount' },
            { columnNum: 2, value: 'totalExpenseSum' },
        ],
        columnsDocs: columnsDocs,
        buttons: BUTTON_SETS
    },
    {
        code: '349143',
        endpoint: '/api/CommercialWork/DocInvoice/DocDirector/Filter',
        employeeType: 1,
        totalInfoColumn: [
            { columnNum: 0, value: 'totalCount' },
            { columnNum: 3, value: 'totalExpenseSum' },
        ],
        columnsDocs: columnsEmployee,
        buttons: BUTTON_SETS
    },
    {
        code: '341652',
        endpoint: '/api/CommercialWork/DocInvoice/DocDirector/Filter',
        employeeType: 3,
        totalInfoColumn: [
            { columnNum: 0, value: 'totalCount' },
            { columnNum: 2, value: 'totalExpenseSum' },
        ],
        columnsDocs: columnsTax,
        buttons: BUTTON_SETS
    }
];
