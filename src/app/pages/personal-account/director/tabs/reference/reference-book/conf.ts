export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'api/User',
        pageTitle: 'Сотрудники',
        tableColumns: [
            { label: 'Фамилия', field: 'lastName' },
            { label: 'Имя', field: 'firstName' },
            { label: 'Отчество', field: 'patronymic' },
            { label: 'Дожность', field: 'position.name' },
            { label: '', field: '' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text' },
            { label: 'Имя', field: 'firstName', type: 'text' },
            { label: 'Отчество', field: 'patronymic', type: 'text' },
            { label: 'Дожность', field: 'representationOrder', type: 'text' },
        ],
    },
    {
        typeId: '495142',
        endpoint: 'api/Entities/ProductTarget',
        pageTitle: 'Назначение товара',
        tableColumns: [
            { label: 'Код', field: 'code' },
            { label: 'Наименование', field: 'name' },
            { label: 'Короткое наименование', field: 'shortName' },
            { label: 'Коэффициент', field: 'coef' },
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
        endpoint: 'api/Entities/MeasurementUnit',
        pageTitle: 'Единицы измерения',
        tableColumns: [
            { label: 'Код', field: 'code' },
            { label: 'Наименование', field: 'name' },
            { label: 'Короткое наименование', field: 'shortName' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text' },
            { label: 'Наименование', field: 'name', type: 'text' },
            { label: 'Короткое наименование', field: 'shortName', type: 'text'  },
        ],

    },

]