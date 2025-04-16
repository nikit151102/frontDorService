import { ButtonConfig } from "../../components/partner-menu/button-config";

export const BUTTON_SETS: Record<string, ButtonConfig[]> = {
    supplier: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.editStatus,
        }
    ],
    mechanic: [
        {
            label: 'Подробнее',
            action: 'openDialog',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.editStatus !== 0 && product.editStatus !== 3,
        },
        {
            label: 'Изменить',
            action: 'openDialog',
            class: 'btn-edit',
            isEditData: true,
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите внести изменения?',
            condition: (product) => product.editStatus === 0 || product.editStatus === 3 || product.editStatus === 9,
        },
        {
            label: 'Удалить',
            action: 'deleteCounterparty',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить контрагента?',
            condition: (product) => product.editStatus === 0 || product.editStatus === 3 || product.editStatus === 9,
        }
    ],
    director: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.editStatus,
        },
        //Статус контрагента = 1
        {
            label: 'Принять',
            action: 'verificationPartner',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать контрагента?',
            status: 7,
            condition: (product) => product.editStatus === 1,
        },
        {
            label: 'Отклонить',
            action: 'verificationPartner',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить контрагента?',
            status: 10,
            condition: (product) => product.editStatus === 1,
        },
        
        //Статус контрагента = 2
        {
            label: 'Принять',
            action: 'verificationPartner',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать контрагента?',
            status: 7,
            condition: (product) => product.editStatus === 2,
        },
        {
            label: 'Отклонить',
            action: 'verificationPartner',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить контрагента?',
            status: 10,
            condition: (product) => product.editStatus === 2,
        },


        //Статус контрагента = 3
        {
            label: 'Принять',
            action: 'verificationPartner',
            class: 'btn-send',
            titlePopUp: 'Подтверждение подписи',
            messagePopUp: 'Вы уверены, что хотите подписать контрагента?',
            status: 7,
            condition: (product) => product.editStatus === 3,
        },
        {
            label: 'Отклонить',
            action: 'verificationPartner',
            class: 'btn-send',
            titlePopUp: 'Подтверждение отклонения',
            messagePopUp: 'Вы уверены, что хотите отклонить контрагента?',
            status: 10,
            condition: (product) => product.editStatus === 3,
        },

        {
            label: 'Изменить',
            action: 'getInvoiceById',
            class: 'btn-edit',
            titlePopUp: 'Редактирование фактуры',
            messagePopUp: 'Вы уверены, что хотите изменить информацию контрагента?',
            condition: (product) => product.editStatus,
        },
        {
            label: 'Удалить',
            action: 'deleteCounterparty',
            class: 'btn-delete',
            titlePopUp: 'Подтверждение удаления',
            messagePopUp: 'Вы уверены, что хотите удалить контрагента?',
            condition: (product) => product.editStatus,
        },
    ],
    default: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            condition: (product) => product.editStatus !== 0 && product.editStatus !== 3,
        }
    ]
};

