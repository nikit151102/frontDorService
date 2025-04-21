import { ConfirmPopupService } from "../../../../../components/confirm-popup/confirm-popup.service";
import { InvoiceConfig } from "../../../../../interfaces/common.interface";

interface FormDataSources {
    productTarget: any[];
  }

  
export function getFormSets(productsTarget:FormDataSources): InvoiceConfig {
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
        },
        {
            name: 'productTarget.Id',
            label: 'Назначение',
            type: 'dropdown',
            placeholder: 'Выберите назначение',
            options: productsTarget.productTarget || [],
            optionLabel: 'name',
            optionValue: 'id',
            min: 0,
            max: 0,
            onChange: (selectedId: string, model: any) => {
                console.log('Выбрано назначение с id:', selectedId);
                model['productTargetId'] = selectedId; 
                console.log('model',model)
              },
        },
        {
            name: 'productName',
            label: 'Наименование',
            type: 'text',
            placeholder: 'Введите номер',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
        {
            name: 'manufacturer',
            label: 'Поставщик',
            type: 'text',
            placeholder: 'Введите поставщика',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
        },
        {
            name: 'expenseSum',
            label: 'Сумма',
            type: 'number',
            placeholder: 'Введите сумму',
            options: [],
            optionLabel: '',
            optionValue: '',
            min: 0,
            max: 0,
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

    let data = {
        dateTime: model.dateTime,
        type: 1,
        docPaymentType: model.docPaymentType,
        manufacturer: model.manufacturer,
        productList: [{
            productTargetId: model.productTargetId || '',
            quantity: 1,
            name: model.productName,
            amount: model.expenseSum
        }]
    };
    
    data = invoicesService.setTypeAnton(data)
   
    const titlePopUp = model && model.id ? 'Вы действительно хотите обновить данные?' : 'Вы действительно хотите создать счет-фактуру?';
    const acceptLabel = model && model.id ? 'Обновить' : 'Создать';

    confirmPopupService.openConfirmDialog({
        title: '',
        message: titlePopUp,
        acceptLabel: acceptLabel,
        rejectLabel: 'Отмена',
        onAccept: () => {
            
            invoiceService.saveInvoice(data, 'api/CommercialWork/DocInvoice' , 1).subscribe(
                (invoice: any) => {
                    console.log('invoice.documentMetadata.data', invoice.documentMetadata.data);
                    if(!send) {
                        let item =invoice.documentMetadata.data;

                        item.productTarget =  model.productTarget.name;
                        item.name = item.productList[0].name;

                        invoicesService.addItemToStart(item);
                        sendClose();
                    }
                    toastService.showSuccess('Сохранение', 'Счет-фактура сохранена');

                    const currentRole = jwtService.getDecodedToken().email;
                    let verificationLevel = currentRole === '3' ? 2 : (currentRole === '1' ? 5 : null);
                    if (send) {
                        invoiceService.sendingVerification(invoice.documentMetadata.data, verificationLevel).subscribe(
                            (data: any) => { 
                                let item = data.data;

                                item.productTarget =  model.productTarget.name;
                                item.name = item.productList[0].name;
        
                                invoicesService.addItemToStart(item);
                    
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
    productTargetId: '',
    number: '',
    expenseSum: '',
    incomeSum: '',
    type: 1,
    docPaymentType: 2,
    antonCashType: 0
};
