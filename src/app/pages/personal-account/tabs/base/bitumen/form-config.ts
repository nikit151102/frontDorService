import { ConfirmPopupService } from "../../../../../components/confirm-popup/confirm-popup.service";
import { InvoiceConfig } from "../../../../../interfaces/common.interface";

interface FormDataSources {
    productTarget: any[];
  }

  
export function getFormArrivalSets(productsTarget:FormDataSources): InvoiceConfig {
    return {
    fields: [
        {
            name: 'dateTime',
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
            name: 'placeFrom',
            label: 'Откуда',
            type: 'text',
            placeholder: '',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'group1'
        },
        {
            name: 'placeTo',
            label: 'Куда слил',
            type: 'text',
            placeholder: '',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'group1'
        },
        
        {
            name: 'cargoId',
            label: 'Груз',
            type: 'dropdown',
            placeholder: 'Выберите груз',
            options: productsTarget.productTarget || [],
            optionLabel: 'name',
            optionValue: 'id',
            min: 0,
            max: 0,
            rowGroup: 'single',
            onChange: (selectedId: string, model: any) => {
                console.log('Выбрано груза с id:', selectedId);
                model['cargoId'] = selectedId; 
                console.log('model',model)
              },
        },
        {
            name: 'ttn',
            label: 'ТТН',
            type: 'text',
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
            type: 'text',
            placeholder: 'Введите тоннаж',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'single'
        },
        {
            name: 'amount',
            label: 'Цена',
            type: 'text',
            placeholder: 'Введите цену',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'single'
        },
        {
            name: 'paymentType',
            label: 'Форма оплаты',
            type: 'dropdown',
            placeholder: 'Форма оплаты',
            options: [{label: 'Нал', value: 0},
                {label: 'Без нал', value: 1},
                {label: 'Без нал без НДС', value: 2}
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
            label: 'Сохранить и отправить',
            action: (model: any, dependencies: any, sendClose:any) => handleSaveAndSend(model, dependencies, true, sendClose),
        },
        {
            label: 'Черновик',
            action: (model: any, dependencies: any, sendClose:any) => handleSaveAndSend(model, dependencies, false, sendClose),
        },
        {
            label: 'Отменить',
            action: (model: any) => {
            },
        },
    ],
}
};


export function getFormExpenseSets(productsTarget:FormDataSources): InvoiceConfig {
    return {
    fields: [
        {
            name: 'dateTime',
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
            name: 'placeFrom',
            label: 'Откуда',
            type: 'text',
            placeholder: '',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'group1'
        },
        {
            name: 'placeTo',
            label: 'Кому',
            type: 'text',
            placeholder: '',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'group1'
        },
        
        {
            name: 'cargoId',
            label: 'Груз',
            type: 'dropdown',
            placeholder: 'Выберите груз',
            options: productsTarget.productTarget || [],
            optionLabel: 'name',
            optionValue: 'id',
            min: 0,
            max: 0,
            rowGroup: 'single',
            onChange: (selectedId: string, model: any) => {
                console.log('Выбрано груза с id:', selectedId);
                model['cargoId'] = selectedId; 
                console.log('model',model)
              },
        },
        {
            name: 'weight',
            label: 'Тоннаж',
            type: 'text',
            placeholder: 'Введите тоннаж',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'single'
        },
        {
            name: 'amount',
            label: 'Цена',
            type: 'text',
            placeholder: 'Введите цену',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
            rowGroup: 'single'
        },
        {
            name: 'paymentType',
            label: 'Форма оплаты',
            type: 'dropdown',
            placeholder: 'Форма оплаты',
            options: [{label: 'Нал', value: 0},
                {label: 'Без нал', value: 1},
                {label: 'Без нал без НДС', value: 2}
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
            label: 'Сохранить и отправить',
            action: (model: any, dependencies: any, sendClose:any) => handleSaveAndSend(model, dependencies, true, sendClose),
        },
        {
            label: 'Черновик',
            action: (model: any, dependencies: any, sendClose:any) => handleSaveAndSend(model, dependencies, false, sendClose),
        },
        {
            label: 'Отменить',
            action: (model: any) => {
            },
        },
    ],
}
};

function handleSaveAndSend(model: any, dependencies: any, send: boolean, sendClose: Function) {
    const { confirmPopupService, invoiceService, productsService,invoicesService, messageService, toastService, jwtService } = dependencies;

    const data = {
        dateTime: model.dateTime || '',
        auto: model.auto || '',
        placeFrom: model.placeFrom || '',
        placeTo: model.placeTo || '',
        cargoId: model.cargoId || '',
        ttn: model.ttn || 2,
        weight: model.weight || 2,
        amount: model.amount || 0,
        managerDocType: model.managerDocType || 0,
        status: model.status || 0,
        paymentType: model.paymentType || 0,
        comment: model.comment || '',
    };
    

    const titlePopUp = model && model.id ? 'Вы действительно хотите обновить данные?' : 'Вы действительно хотите создать счет-фактуру?';
    const acceptLabel = model && model.id ? 'Обновить' : 'Создать';

    confirmPopupService.openConfirmDialog({
        title: '',
        message: titlePopUp,
        acceptLabel: acceptLabel,
        rejectLabel: 'Отмена',
        onAccept: () => {
            
            invoiceService.saveInvoice(data, 'api/CommercialWork/ManagerDocument').subscribe(
                (invoice: any) => {
                    console.log('invoice.documentMetadata.data', invoice.documentMetadata.data);
                    if(!send) {
                        invoicesService.addItemToStart(invoice.documentMetadata.data);
                        sendClose();
                    }
                    toastService.showSuccess('Сохранение', 'Счет-фактура сохранена');

                    const currentRole = jwtService.getDecodedToken().email;
                    let verificationLevel = currentRole === '3' ? 2 : (currentRole === '1' ? 5 : null);
                    if (send) {
                        invoiceService.sendingVerification(invoice.documentMetadata.data, verificationLevel, 'api/CommercialWork/ManagerDocument').subscribe(
                            (data: any) => { invoicesService.addItemToStart(data.data);
                                sendClose();
                            },
                            (error:any) => {
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
    dateTime: '',
    auto: '',
    placeFrom: '',
    placeTo: '',
    cargoId: '',
    ttn: 2,
    weight: 2,
    amount: 0,
    managerDocType: 0,
    status: 0,
    paymentType: 0, 
    comment: '',
};
