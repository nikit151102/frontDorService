export const columnsProducts = [
    { field: 'productTarget.Id', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'name', fieldView: 'name', header: 'Товар', type: 'string', visible: true, width: '17%' },
    { field: 'quantity', fieldView: 'quantity', header: 'Количество', type: 'number', visible: true, width: '11%' },
    { field: 'measurementUnit.Id', fieldView: 'measurementUnit', filterType: 10, searchType: 'measurementUnit.Name', header: 'Ед.изм', type: 'uuid', visible: true, width: '11%', endpoint: '/api/Entities/MeasurementUnit/Filter' },
    { field: 'sumAmount', fieldView: 'sumAmount', header: 'Общая сумма', type: 'number', visible: true, width: '11%' },
    { field: 'DocInvoice.Number', fieldView: 'docInvoice', header: 'Номер фактуры', type: 'string', visible: true, width: '10%', isFilter: false },
    { field: 'DocInvoice.DateTime', fieldView: 'dateTime', header: 'Дата фактуры', type: 'date', visible: true, width: '13%' },
    { field: 'DocInvoice.Status', fieldView: 'docInvoiceStatus', header: 'Статус фактуры', type: 'enam', visible: true, width: '16%' },
    { field: 'DocInvoice.CreatorName', fieldView: 'creatorName', header: 'Создатель', type: 'string', visible: true, width: '16%' },
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
        code: '349142',
        endpoint: 'api/CommercialWork/Product/Filter/00000000-0000-0000-0000-000000000000',
        employeeType: 1,
        totalInfoColumn: [
            { columnNum: 0, value: 'totalCount' },
            { columnNum: 2, value: 'totalExpenseSum' },
            { columnNum: 4, value: 'totalIncomeSum' },
        ],
        columnsDocs: columnsProducts,
        buttons: BUTTON_SETS
    },
];
