import { ConfirmPopupService } from "../../../../../components/confirm-popup/confirm-popup.service";
import { InvoiceConfig } from "../../../../../interfaces/common.interface";

interface FormDataSources {
    productTarget: any[];
    placeFroms: any[];
    organizations: any[];
    storageArea: any[];
    filter: any;
}


export function getFormArrivalSets(productsTarget: FormDataSources): InvoiceConfig {
    return {
        fields: [
            {
                name: 'date',
                label: 'Дата',
                type: 'date',
                placeholder: 'Выберите дату',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'auto',
                label: 'Авто',
                type: 'text',
                placeholder: 'Введите автомобиль',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'placeFromId',
                label: 'Откуда',
                type: 'dropdown',
                placeholder: 'Выберите запись',
                options: productsTarget.placeFroms || [],
                optionLabel: 'name',
                optionValue: 'id',
                min: 0,
                max: 0,
                rowGroup: 'group1',
                onChange: (selectedId: string, model: any) => {
                    console.log('Выбрано Откуда с id:', selectedId);
                    model['placeFromId'] = selectedId;
                    console.log('model', model)
                },
            },
            {
                name: 'placeToId',
                label: 'Куда слили',
                type: 'dropdown',
                placeholder: 'Выберите запись',
                options: productsTarget.storageArea || [],
                optionLabel: 'name',
                optionValue: 'id',
                min: 0,
                max: 0,
                rowGroup: 'group1',
                onChange: (selectedId: string, model: any) => {
                    console.log('Выбрано куда слили с id:', selectedId);
                    model['placeToId'] = selectedId;
                    console.log('model', model)
                },
            },

            {
                name: 'cargoId',
                label: 'Груз',
                type: 'dropdown',
                placeholder: 'Выберите груз',
                options: productsTarget.productTarget || [],
                optionLabel: 'cargoName',
                optionValue: 'id',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    console.log('Выбрано груза с id:', selectedId);
                    model['cargoId'] = selectedId;
                    console.log('model', model)
                },
            },
            {
                name: 'ttn',
                label: 'ТТН',
                type: 'number',
                placeholder: 'Введите ТТН',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'weight',
                label: 'Тоннаж',
                type: 'number',
                placeholder: 'Введите тоннаж',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    if (model['weight'] != null && model['amount'] != null) {
                        model['sumAmount'] = model['weight'] * model['amount'];
                        if ((model['weight'] < 0 && model['amount'] > 0) || (model['weight'] > 0 && model['amount'] < 0)) {
                            model['sumAmount'] = -Math.abs(model['sumAmount']);
                        }
                    }
                    if (model['weight'] != null && model['sumAmount'] != null) {
                        if (model['weight'] !== 0) {
                            model['amount'] = model['sumAmount'] / model['weight'];
                            if ((model['sumAmount'] < 0 && model['weight'] > 0) || (model['sumAmount'] > 0 && model['weight'] < 0)) {
                                model['amount'] = -Math.abs(model['amount']);
                            }
                        } else {
                            model['amount'] = 0;
                        }
                    }
                },
            },
            {
                name: 'amount',
                label: 'Цена',
                type: 'number',
                placeholder: 'Введите цену',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    if (model['weight'] != null && model['amount'] != null) {
                        model['sumAmount'] = model['weight'] * model['amount'];
                        if ((model['weight'] < 0 && model['amount'] > 0) || (model['weight'] > 0 && model['amount'] < 0)) {
                            model['sumAmount'] = -Math.abs(model['sumAmount']);
                        }
                    }
                },
            },
            {
                name: 'sumAmount',
                label: 'Сумма',
                type: 'number',
                placeholder: 'Введите сумму',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    if (model['weight'] != null && model['sumAmount'] != null) {
                        if (model['weight'] !== 0) {
                            model['amount'] = model['sumAmount'] / model['weight'];
                            if ((model['sumAmount'] < 0 && model['weight'] > 0) || (model['sumAmount'] > 0 && model['weight'] < 0)) {
                                model['amount'] = -Math.abs(model['amount']);
                            }
                        } else {
                            model['amount'] = 0;
                        }
                    }
                },
            },
            {
                name: 'paymentType',
                label: 'Форма оплаты',
                type: 'dropdown',
                placeholder: 'Форма оплаты',
                options: [{ label: 'Нал', value: 0 },
                { label: 'НДС', value: 1 },
                { label: 'без НДС', value: 2 }
                ],
                optionLabel: 'label',
                optionValue: 'value',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'comment',
                label: 'Комментарий',
                type: 'text',
                placeholder: 'Введите комментарий',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            }
        ],
        buttons: [
            {
                label: 'Изменить',
                condition: (data, userRoleId) => data.id,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose),
            },
            {
                label: 'Сохранить и отправить',
<<<<<<< HEAD
                condition: (data, userRoleId) => !data.id && userRoleId != 1,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose),
            },
            {
                label: 'Сохранить',
                condition: (data, userRoleId) => !data.id && userRoleId == 1,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose),
            },
            {
                label: 'Черновик',
                condition: (data, userRoleId) => !data.id && userRoleId != 1,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, false, sendClose),
=======
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose, productsTarget.filter),
            },
            {
                label: 'Черновик',
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, false, sendClose, productsTarget.filter),
>>>>>>> test-api-endpoints
            },
            {
                label: 'Отменить',
                condition: (data, userRoleId) => true,
                action: (model: any) => {
                },
            },
        ],
    }
};


export function getFormExpenseSets(productsTarget: FormDataSources): InvoiceConfig {
    return {
        fields: [
            {
                name: 'date',
                label: 'Дата',
                type: 'date',
                placeholder: 'Выберите дату',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'auto',
                label: 'Авто',
                type: 'text',
                placeholder: 'Введите автомобиль',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'placeToId',
                label: 'Откуда',
                type: 'dropdown',
                placeholder: 'Выберите запись',
                options: productsTarget.storageArea || [],
                optionLabel: 'name',
                optionValue: 'id',
                min: 0,
                max: 0,
                rowGroup: 'group1',
                onChange: (selectedId: string, model: any) => {
                    console.log('Выбрано Откуда с id:', selectedId);
                    model['placeToId'] = selectedId;
                    console.log('model', model)
                },
            },
            {
                name: 'organizationId',
                label: 'Кому',
                type: 'dropdown',
                placeholder: 'Выберите запись',
                options: productsTarget.organizations || [],
                optionLabel: 'name',
                optionValue: 'id',
                min: 0,
                max: 0,
                rowGroup: 'group1',
                onChange: (selectedId: string, model: any) => {
                    console.log('Выбрано куда слили с id:', selectedId);
                    model['organizationId'] = selectedId;
                    console.log('model', model)
                },
            },

            {
                name: 'cargoId',
                label: 'Груз',
                type: 'dropdown',
                placeholder: 'Выберите груз',
                options: productsTarget.productTarget || [],
                optionLabel: 'cargoName',
                optionValue: 'id',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    console.log('Выбрано груза с id:', selectedId);
                    model['cargoId'] = selectedId;
                    console.log('model', model)
                },
            },
            {
                name: 'weight',
                label: 'Тоннаж',
                type: 'number',
                placeholder: 'Введите тоннаж',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    if (model['weight'] != null && model['amount'] != null) {
                        model['sumAmount'] = model['weight'] * model['amount'];
                        if ((model['weight'] < 0 && model['amount'] > 0) || (model['weight'] > 0 && model['amount'] < 0)) {
                            model['sumAmount'] = -Math.abs(model['sumAmount']);
                        }
                    }
                    if (model['weight'] != null && model['sumAmount'] != null) {
                        if (model['weight'] !== 0) {
                            model['amount'] = model['sumAmount'] / model['weight'];
                            if ((model['sumAmount'] < 0 && model['weight'] > 0) || (model['sumAmount'] > 0 && model['weight'] < 0)) {
                                model['amount'] = -Math.abs(model['amount']);
                            }
                        } else {
                            model['amount'] = 0;
                        }
                    }
                },
            },
            {
                name: 'amount',
                label: 'Цена',
                type: 'number',
                placeholder: 'Введите цену',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    if (model['weight'] != null && model['amount'] != null) {
                        model['sumAmount'] = model['weight'] * model['amount'];
                        if ((model['weight'] < 0 && model['amount'] > 0) || (model['weight'] > 0 && model['amount'] < 0)) {
                            model['sumAmount'] = -Math.abs(model['sumAmount']);
                        }
                    }
                },
            },
            {
                name: 'sumAmount',
                label: 'Сумма',
                type: 'number',
                placeholder: 'Введите сумму',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single',
                onChange: (selectedId: string, model: any) => {
                    if (model['weight'] != null && model['sumAmount'] != null) {
                        if (model['weight'] !== 0) {
                            model['amount'] = model['sumAmount'] / model['weight'];
                            if ((model['sumAmount'] < 0 && model['weight'] > 0) || (model['sumAmount'] > 0 && model['weight'] < 0)) {
                                model['amount'] = -Math.abs(model['amount']);
                            }
                        } else {
                            model['amount'] = 0;
                        }
                    }
                },
            },
            {
                name: 'paymentType',
                label: 'Форма оплаты',
                type: 'dropdown',
                placeholder: 'Форма оплаты',
                options: [{ label: 'Нал', value: 0 },
                { label: 'НДС', value: 1 },
                { label: 'без НДС', value: 2 }
                ],
                optionLabel: 'label',
                optionValue: 'value',
                min: 0,
                max: 0,
                rowGroup: 'single'
            },
            {
                name: 'comment',
                label: 'Комментарий',
                type: 'text',
                placeholder: 'Введите цену',
                options: [],
                optionLabel: '',
                optionValue: '',
                min: 0,
                max: 0,
                rowGroup: 'single'
            }
        ],
        buttons: [
            {
                label: 'Изменить',
                condition: (data, userRoleId) => data.id,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose),
            },
            {
                label: 'Сохранить и отправить',
<<<<<<< HEAD
                condition: (data, userRoleId) => !data.id && userRoleId != 1,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose),
            },
            {
                label: 'Сохранить',
                condition: (data, userRoleId) => !data.id && userRoleId == 1,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose),
            },
            {
                label: 'Черновик',
                condition: (data, userRoleId) => !data.id && userRoleId != 1,
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, false, sendClose),
=======
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, true, sendClose, productsTarget.filter),
            },
            {
                label: 'Черновик',
                action: (model: any, dependencies: any, sendClose: any) => handleSaveAndSend(model, dependencies, false, sendClose, productsTarget.filter),
>>>>>>> test-api-endpoints
            },
            {
                label: 'Отменить',
                condition: (data, userRoleId) => true,
                action: (model: any) => {
                },
            },
        ],
    }
};

function handleSaveAndSend(model: any, dependencies: any, send: boolean, sendClose: Function, filter: any) {
    const { confirmPopupService, invoiceService, productsService, invoicesService, messageService, toastService, jwtService } = dependencies;
    const managerDocTypeFromSession = sessionStorage.getItem('managerDocType')

    let dataForm: any = {
        date: model.date || '',
        auto: model.auto || '',
        placeFromId: model.placeFromId || null,
        placeToId: model.placeToId || null,
        organizationId: model.organizationId || null,
        cargoId: model.cargoId || model.id || null,
        ttn: model.ttn || 0,
        weight: model.weight || 0,
        amount: model.amount || 0,
        managerDocType: managerDocTypeFromSession !== null ? Number(managerDocTypeFromSession) : (model.managerDocType || 2),
        status: model.status || 0,
        paymentType: model.paymentType || 0,
        comment: model.comment || '',
    };

    if (send) {
        const requiredFields = [
            'date',
            'auto',
            'placeFromId',
            'placeToId',
            'cargoId',
            'ttn',
            'weight',
            'amount'
        ];

        const zeroAllowedFields = ['paymentType'];

        const numericFields = [
            { name: 'ttn', min: 0 },
            { name: 'weight', min: 0 },
            { name: 'amount', min: 0 }
        ];

        for (const field of requiredFields) {
            const value = model[field];

            if (value === null ||
                value === undefined ||
                value === '' ||
                (typeof value === 'number' && value === 0 && !zeroAllowedFields.includes(field))) {
                toastService.showError('Ошибка', `Поле "${field}" обязательно для заполнения`);
                return;
            }
        }

        for (const field of numericFields) {
            const value = model[field.name];

            if (value !== null && value !== undefined) {
                if (typeof value !== 'number' || value < field.min) {
                    toastService.showError('Ошибка', `Поле "${field.name}" должно быть числом не менее ${field.min}`);
                    return;
                }
            }
        }
    }

    if (!model.cargoId) {
        delete dataForm.cargoId;
    }

    if (model.hasOwnProperty('id')) {
        dataForm.id = model.id;
    }

    const titlePopUp = dataForm && dataForm.cargoId ? 'Вы действительно хотите обновить данные?' : 'Вы действительно хотите создать фактуру?';
    const acceptLabel = dataForm && dataForm.cargoId ? 'Обновить' : 'Создать';

    confirmPopupService.openConfirmDialog({
        title: '',
        message: titlePopUp,
        acceptLabel: acceptLabel,
        rejectLabel: 'Отмена',
        onAccept: () => {

            invoiceService.saveInvoice(dataForm, 'api/CommercialWork/ManagerDocument', null, filter).subscribe(
                (invoice: any) => {
                    if (!send) {
                        invoicesService.addItemToStart(invoice.data);
                        sendClose();
                    }
                    toastService.showSuccess('Сохранение', 'Счет-фактура сохранена');

                    const currentRole = jwtService.getDecodedToken().email;
                    // let verificationLevel = currentRole === '5' ? 2 : (currentRole === '1' ? 5 : null);
                    let verificationLevel = currentRole === '1' ? 5 : 2;
                    if (send) {
                        invoiceService.sendingVerification(invoice.documentMetadata.data, verificationLevel, 'api/CommercialWork/ManagerDocument').subscribe(
                            (data: any) => {
                                invoicesService.addItemToStart(data.data);
                                sendClose();
                            },
                            (error: any) => {
                                console.error('Ошибка при отправке на проверку:', error);
                            }
                        );
                    }
                },
                (error: any) => {
                    console.error('Ошибка при сохранении счета', error);
                    toastService.showError('Ошибка', error.Message || 'Неизвестная ошибка');
                }
            );
        }
    });
}

export const MODEL = {
    date: '',
    auto: '',
    placeFrom: null,
    placeTo: null,
    organizationId: null,
    cargoId: '',
    ttn: 0,
    weight: 0,
    amount: 0,
    sumAmount: 0,
    managerDocType: 0,
    status: 0,
    paymentType: 0,
    comment: '',
};
