export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'api/User',
        pageTitle: 'Сотрудники',
        tableColumns: [
            { label: 'Фамилия', field: 'lastName', type: 'string'},
            { label: 'Имя', field: 'firstName' , type: 'string'},
            { label: 'Отчество', field: 'patronymic', type: 'string' },
            { label: 'Дожность', field: 'position.name', type: 'string' },
            { label: '', field: '' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text' },
            { label: 'Имя', field: 'firstName', type: 'text' },
            { label: 'Отчество', field: 'patronymic', type: 'text' },
            { label: 'Дожность', field: 'representationOrder', type: 'dropdown' },
            { label: 'Права доступа', field: 'representationOrder', type: 'checkboxes' },
        ],
    },
    {
        typeId: '495142',
        endpoint: 'api/Entities/MeasurementUnit',
        pageTitle: 'Единицы измерения',
        tableColumns: [
            { label: 'Код', field: 'code' , type: 'string'},
            { label: 'Наименование', field: 'name', type: 'string' },
            { label: 'Короткое наименование', field: 'shortName', type: 'string' },
            { label: 'Коэффициент', field: 'coef' , type: 'number'},
            
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text' },
            { label: 'Наименование', field: 'name', type: 'text' },
            { label: 'Короткое наименование', field: 'shortName', type: 'text' },
            { label: 'Коэффициент', field: 'coef', type: 'text' },
        ],
    },
    {
        typeId: '915825',
        endpoint: 'api/Entities/ProductTarget',
        pageTitle: 'Назначение товара',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string' },
            { label: 'Наименование', field: 'name', type: 'string' },
            { label: 'Короткое наименование', field: 'shortName', type: 'string' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text' },
            { label: 'Наименование', field: 'name', type: 'text' },
            { label: 'Короткое наименование', field: 'shortName', type: 'text'  },
        ],

    },

]