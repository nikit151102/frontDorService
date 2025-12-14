export const endpoint = 'api/CommercialWork/MonthTaxRatio'
export const totalInfoColumn = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 3, value: 'totalDifferentOdometer' },
    { columnNum: 4, value: 'totalGrossSum' },
    { columnNum: 5, value: 'totalKilometerCost' },
];


export const columnsDocs = [
    {
        header: '',
        columns: [
            {
                field: 'dateTime',
                fieldView: 'monthYear',
                filterType: 10,
                searchField: 'dateTime',
                header: 'Месяц',
                type: 'date',
                visible: true,
                width: '16%'
            },
        ],
        visible: true,
        width: '16%'
    },
    {
        header: 'Логистика',
        columns: [
            {
                field: 'logisticsCash',
                fieldView: 'logisticsCash',
                header: 'Нал',
                type: 'number',
                visible: true,
                width: '15%'
            },
            {
                field: 'logisticsNoNds',
                fieldView: 'logisticsNoNds',
                header: 'без НДС',
                type: 'number',
                visible: true,
                width: '15%'
            }
        ],
        visible: true,
        width: '30%'
    },
    {
        header: 'Ремонт',
        columns: [
            {
                field: 'repaitsCash',
                fieldView: 'repaitsCash',
                header: 'Нал',
                type: 'number',
                visible: true,
                width: '15%'
            },
            {
                field: 'repaitsNoNds',
                fieldView: 'repaitsNoNds',
                header: 'Без НДС',
                type: 'number',
                visible: true,
                width: '15%'
            },
        ],
        visible: true,
        width: '30%'
    },
    {
        header: 'Гараж',
        columns: [
            {
                field: 'garageCash',
                fieldView: 'garageCash',
                header: 'Нал',
                type: 'number',
                visible: true,
                width: '15%'
            },
            {
                field: 'garageNoNds',
                fieldView: 'garageNoNds',
                header: 'Без НДС',
                type: 'number',
                visible: true,
                width: '15%'
            },
        ],
        visible: true,
        width: '30%'
    },
    {
        header: 'ЗП офис',
        columns: [
            {
                field: 'officeSalaryCash',
                fieldView: 'officeSalaryCash',
                header: 'Нал',
                type: 'number',
                visible: true,
                width: '15%'
            },
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'ЗП водители',
        columns: [
            {
                field: 'driversSalaryCash',
                fieldView: 'driversSalaryCash',
                header: 'Нал',
                type: 'number',
                visible: true,
                width: '15%'
            },
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'Платон',
        columns: [
            {
                field: 'platonNoNds',
                fieldView: 'platonNoNds',
                header: 'Без НДС',
                type: 'number',
                visible: true,
                width: '15%'
            },
        ],
        visible: true,
        width: '15%'
    },
    {
        header: 'Налоги',
        columns: [
            {
                field: 'taxesNoNds',
                fieldView: 'taxesNoNds',
                header: 'Без НДС',
                type: 'number',
                visible: true,
                width: '15%'
            },
        ],
        visible: true,
        width: '15%'
    }
];



export const viewDataColumns = [
    {
        field: 'dateTime',
        fieldView: 'monthYear',
        filterType: 10,
        searchField: 'dateTime',
        header: 'Месяц',
        type: 'date',
        visible: true,
        width: '16%'
    },
    {
        field: 'logisticsCash',
        fieldView: 'logisticsCash',
        header: 'Логистика (нал)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'logisticsNoNds',
        fieldView: 'logisticsNoNds',
        header: 'Логистика (без НДС)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'repaitsCash',
        fieldView: 'repaitsCash',
        header: 'Ремонты (нал)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'repaitsNoNds',
        fieldView: 'repaitsNoNds',
        header: 'Ремонты (без НДС)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'garageCash',
        fieldView: 'garageCash',
        header: 'Гараж (нал)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'garageNoNds',
        fieldView: 'garageNoNds',
        header: 'Гараж (без НДС)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'officeSalaryCash',
        fieldView: 'officeSalaryCash',
        header: 'ЗП офис (нал)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'driversSalaryCash',
        fieldView: 'driversSalaryCash',
        header: 'ЗП водители (нал)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'platonNoNds',
        fieldView: 'platonNoNds',
        header: 'Платон (без НДС)',
        type: 'number',
        visible: true,
        width: '15%'
    },
    {
        field: 'taxesNoNds',
        fieldView: 'taxesNoNds',
        header: 'Налоги (без НДС)',
        type: 'number',
        visible: true,
        width: '15%'
    },
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

