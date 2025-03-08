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
        typeId: '161283',
        endpoint: 'ConcreteMark',
        pageTitle: 'Единицы измерения',
        tableColumns: [
            { label: 'Код', field: 'code' },
            { label: 'Наименование', field: 'name' },
            { label: 'Короткое наименование', field: 'name' },
            { label: '', field: '' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text' },
            { label: 'Наименование', field: 'name', type: 'text' },
        ],

    },
]

