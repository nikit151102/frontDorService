export interface ButtonConfig {
    label: string;
    action: string;
    titlePopUp?: string;
    messagePopUp?: string;
    status?: number;
    class: string;
    isEditData?: boolean;
    condition?: (product: any, idCurrentUser:any) => boolean;
}

export const BUTTON_SETS: Record<string, ButtonConfig[]> = {
    mechanic: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product, idCurrentUser) => product.status,
        },
        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите внести изменения?',
            isEditData: true,
            condition: (product, idCurrentUser) => product.status === 0 || product.status === 3,
        },
        {
            label: 'Отправить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отправки',
            messagePopUp: 'Вы уверены, что хотите отправить фактуру механику на проверку?',
            status: 2,
            condition: (product, idCurrentUser) => product.status === 0 || product.status === 3,
        },
        {
            label: 'Удалить',
            action: 'deleteInvoice',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить фактуру?',
            condition: (product, idCurrentUser) => product.status === 0 || product.status === 3,
        },
        // {
        //     label: 'Создать фактуру',
        //     action: 'createInvoiceFromAccount',
        //     class: 'btn-send',
        //     titlePopUp: 'Подтверждение отклонения',
        //     messagePopUp: 'Вы уверены, что хотите создать счет?',
        //     condition: (product, idCurrentUser) => (product.docAccountType == 1 || product.docAccountType == 2) && product.docAccountType != 0 && product.status == 5 && product.draft == null,
        //     // && product.creatorId == idCurrentUser
        // }
    ],
    director: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
        },
        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию в этой фактуре?',
            isEditData: true,
        },
        {
            label: 'Подписать',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать фактуру?',
            status: 5,
            condition: (product, idCurrentUser) => product.status === 2,
        },
        {
            label: 'Отклонить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить фактуру?',
            status: 4,
            condition: (product, idCurrentUser) => product.status === 2,
        },
        {
            label: 'Удалить',
            action: 'deleteInvoice',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить фактуру?'
        },
        // {
        //     label: 'Создать фактуру',
        //     action: 'createInvoiceFromAccount',
        //     class: 'btn-send',
        //     titlePopUp: 'Подтверждение отклонения',
        //     messagePopUp: 'Вы уверены, что хотите создать счет?',
        //     condition: (product, idCurrentUser) => (product.docAccountType == 1 || product.docAccountType == 2) && product.docAccountType != 0 && product.status == 5 && product.draft == null,
        //     // && product.creatorId == idCurrentUser
        // }
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

