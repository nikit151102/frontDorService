export const endpoint = 'api/CommercialWork/DocLogisticShift'
export const totalInfoColumn = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 3, value: 'totalDifferentOdometer' },
    { columnNum: 4, value: 'totalGrossSum' },
    { columnNum: 5, value: 'totalKilometerCost' },
];


export const columnsDocs = [
    { field: 'ProductTarget.Id', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '20%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'monthYear', fieldView: 'monthYear', header: 'Месяц', type: 'date', visible: true, width: '20%' },
    // { field: 'EndDateTime', fieldView: 'endDateTime', header: 'Окончание', type: 'date', visible: true, width: '15%' },
    { field: 'DifferentOdometer', fieldView: 'differentOdometer', header: 'Разница (км)', type: 'number', visible: true, width: '15%' },
    { field: 'GrossSum', fieldView: 'grossSum', header: 'Вал', type: 'number', visible: true, width: '15%' },
    { field: 'KilometerCost', fieldView: 'kilometerCost', header: 'Вал/км', type: 'number', visible: true, width: '15%' },
    { field: 'DriverEmployeeName', fieldView: 'driverEmployeeName', searchField: 'driverEmployee.Name', header: 'Водитель', type: 'string', visible: true, width: '15%' },
    { field: 'Status', fieldView: 'status', header: 'Статус', type: 'enam', visible: true, width: '15%' },
];

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
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию в этой фактуре?',
            isEditData: true,
            condition: (product, idCurrentUser) => true,
        },
        {
            label: 'Подписать',
            action: 'sendingInvoice',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию в этой фактуре?',
            isEditData: true,
            condition: (product, idCurrentUser) => product.status != 5,
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

