export interface ButtonConfig {
    label: string;
    action: string;
    titlePopUp?: string;
    messagePopUp?: string;
    status?: number;
    class: string;
    isEditData?: boolean;
    condition?: (product: any) => boolean;
}

export const BUTTON_SETS: Record<string, ButtonConfig[]> = {
    supplier: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.status,
        },
        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите внести изменения?',
            isEditData: true,
            condition: (product) => product.status === 0 || product.status === 3,
        },
        {
            label: 'Отправить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отправки',
            messagePopUp: 'Вы уверены, что хотите отправить фактуру механику на проверку?',
            status: 1,
            condition: (product) => product.status === 0 || product.status === 3,
        },
        {
            label: 'Удалить',
            action: 'deleteInvoice',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить фактуру?',
            condition: (product) => product.status === 0 || product.status === 3,
        }
    ],
    mechanic: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.status !== 0 && product.status !== 3,
        },
        {
            label: 'Принять',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение принятия',
            messagePopUp: 'Вы уверены, что хотите отправить фактуру директору на подпись?',
            status: 2,
            condition: (product) => product.status === 1,
        },
        {
            label: 'Отклонить',
            action: 'verificationInvoice',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить фактуру?',
            status: 3,
            condition: (product) => product.status === 1,
        }
    ],
    director: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.status,
        },
        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию в этой фактуре?',
            isEditData: true,
            condition: (product) => product.status,
        },
        {
            label: 'Подписать',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать фактуру?',
            status: 5,
            condition: (product) => product.status === 2,
        },
        {
            label: 'Отклонить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить фактуру?',
            status: 4,
            condition: (product) => product.status === 2,
        },
        {
            label: 'Удалить',
            action: 'deleteInvoice',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить фактуру?',
            condition: (product) => product.status,
        },
    ],
    default: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.status !== 0 && product.status !== 3,
        }
    ]
};

