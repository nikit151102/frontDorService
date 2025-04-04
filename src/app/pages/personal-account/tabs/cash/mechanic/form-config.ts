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
            name: 'expenseSum',
            label: 'Расход',
            type: 'text',
            placeholder: 'Введите расход',
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
            action: (model: any, dependencies: any) => handleSaveAndSend(model, dependencies, true),
        },
        {
            label: 'Черновик',
            action: (model: any, dependencies: any) => handleSaveAndSend(model, dependencies, false),
        },
        {
            label: 'Отменить',
            action: (model: any) => {
            },
        },
    ],
}
};

function handleSaveAndSend(model: any, dependencies: any, send: boolean) {
    const { confirmPopupService, invoiceService, productsService, messageService, toastService, jwtService } = dependencies;

    const data = {
        dateTime: model.dateTime,
        type: 2,
        DocPaymentType: model.DocPaymentType,
        manufacturer: model.manufacturer,
        productList: [{
            productTargetId: model.productTargetId || '',
            quantity: 1,
            name: model.productName,
            amount: model.expenseSum
        }]
    };

    const titlePopUp = model && model.id ? 'Вы действительно хотите обновить данные?' : 'Вы действительно хотите создать счет-фактуру?';
    const acceptLabel = model && model.id ? 'Обновить' : 'Создать';

    confirmPopupService.openConfirmDialog({
        title: '',
        message: titlePopUp,
        acceptLabel: acceptLabel,
        rejectLabel: 'Отмена',
        onAccept: () => {
            invoiceService.saveInvoice(data).subscribe(
                (invoice: any) => {
                    console.log('invoice.documentMetadata.data', invoice.documentMetadata.data);
                    productsService.addItemToStart(invoice.documentMetadata.data);
                    messageService.add({
                        severity: 'success',
                        summary: 'Успех',
                        detail: 'Счет сохранен'
                    });
                    toastService.showSuccess('Сохранение', 'Счет-фактура сохранена');

                    const currentRole = jwtService.getDecodedToken().email;
                    const verificationLevel = currentRole === '3' ? 2 : (currentRole === '2' ? 1 : null);

                    if (verificationLevel) {
                        invoiceService.sendingVerification(invoice, verificationLevel).subscribe(
                            () => {},
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
    type: 2,
    DocPaymentType: 2
};
