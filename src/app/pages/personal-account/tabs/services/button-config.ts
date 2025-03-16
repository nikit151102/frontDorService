import { ButtonConfig } from "../../components/partner-menu/button-config";

export const BUTTON_SETS: Record<string, ButtonConfig[]> = {
    supplier: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.status,
        }
    ],
    mechanic: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.status !== 0 && product.status !== 3,
        },
        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите внести изменения?',
            condition: (product) => product.status === 0 || product.status === 3,
        },
        {
            label: 'Удалить',
            action: 'deleteCounterparty',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить контрагента?',
            condition: (product) => product.status === 0 || product.status === 3,
        }
    ],
    director: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.status,
        },
        //Статус контрагента = 1
        {
            label: 'Принять',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать контрагента?',
            status: 7,
            condition: (product) => product.status === 1,
        },
        {
            label: 'Отклонить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить контрагента?',
            status: 10,
            condition: (product) => product.status === 1,
        },
        
        //Статус контрагента = 2
        {
            label: 'Принять',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать контрагента?',
            status: 7,
            condition: (product) => product.status === 2,
        },
        {
            label: 'Отклонить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить контрагента?',
            status: 10,
            condition: (product) => product.status === 2,
        },


        //Статус контрагента = 3
        {
            label: 'Принять',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать контрагента?',
            status: 7,
            condition: (product) => product.status === 3,
        },
        {
            label: 'Отклонить',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить контрагента?',
            status: 10,
            condition: (product) => product.status === 3,
        },

        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию контрагента?',
            condition: (product) => product.status,
        },
        {
            label: 'Удалить',
            action: 'deleteCounterparty',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить контрагента?',
            condition: (product) => product.status,
        },
    ],
    default: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.status !== 0 && product.status !== 3,
        }
    ]
};

