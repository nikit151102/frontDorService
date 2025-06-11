export const endpoint = 'api/CommercialWork/DocLogisticShift'
export const totalInfoColumn = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 4, value: 'totalDifferentOdometer' },
    { columnNum: 5, value: 'totalGrossSum' },
    { columnNum: 6, value: 'totalKilometerCost' },
];


export const columnsDocs = [
    { field: 'productTarget', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
    // { field: 'status', header: 'Статус', type: 'enum', visible: true, width: '15%' },
    { field: 'beginDateTime', header: 'Начало', type: 'date', visible: true, width: '15%' },
    { field: 'endDateTime', header: 'Окончание', type: 'date', visible: true, width: '15%' },
    { field: 'differentOdometer', header: 'Разница (км)', type: 'number', visible: true, width: '15%' },
    { field: 'grossSum', header: 'Вал', type: 'number', visible: true, width: '15%' },
    { field: 'kilometerCost', header: 'Вал/Км', type: 'number', visible: true, width: '15%' },
    { field: 'driver', header: 'Водитель', type: 'string', visible: true, width: '15%' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '15%' }
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
        }
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

