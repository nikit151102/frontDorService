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

    director: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.status,
        },
        {
            label: 'Провеcти',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение',
            messagePopUp: 'Вы уверены, что хотите провеcти фактуру?',
            status: 7,
            condition: (product) => product.status === 5,
        }
    ],
    accountant: [
        {
            label: 'Подробнее',
            action: 'getInvoiceById',
            class: 'btn-details',
            isEditData: false,
            condition: (product) => product.status,
        },
        {
            label: 'Провеcти',
            action: 'verificationInvoice',
            class: 'btn-send',
            titlePopUp: 'Подтверждение',
            messagePopUp: 'Вы уверены, что хотите провеcти фактуру?',
            status: 7,
            condition: (product) => product.status === 5,
        }
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

