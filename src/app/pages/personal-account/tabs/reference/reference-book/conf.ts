export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'api/User',
        pageTitle: 'Сотрудники',
        tableColumns: [
            { label: 'Фамилия', field: 'lastName', type: 'string', width: '20%' },
            { label: 'Имя', field: 'firstName', type: 'string', width: '20%' },
            { label: 'Должность', field: 'position.name', type: 'string', width: '40%' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text', visible: true },
            { label: 'Имя', field: 'firstName', type: 'text', visible: true },
            { label: 'Отчество', field: 'patronymic', type: 'text', visible: true },
            { label: 'Должность', field: 'positionId', type: 'dropdown', endpoint: 'api/Entities/Position/Filter', visible: true },
            { label: 'Пароль', field: 'password', type: 'text', visible: true },
            { label: 'userName', field: 'userName', type: 'text', visible: false },
            { label: 'email', field: 'email', type: 'text', visible: false },
            { label: 'isMailSend', field: 'isMailSend', type: 'boolean', visible: false },
        ],
    },
    {
        typeId: '915825',
        endpoint: 'api/Entities/MeasurementUnit',
        pageTitle: 'Единицы измерения',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '25%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '25%' },
            { label: 'Короткое наименование', field: 'shortName', type: 'string', width: '25%' },
            { label: 'Коэффициент', field: 'coef', type: 'number', width: '25%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
            { label: 'Короткое наименование', field: 'shortName', type: 'text', visible: true },
            { label: 'Коэффициент', field: 'coef', type: 'text', visible: true },
        ],
    },
    {
        typeId: '495142',
        endpoint: 'api/Entities/ProductTarget',
        pageTitle: 'Назначение товара',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '10%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '49%' },
            { label: 'Категория', field: 'productTargetCategory', type: 'string', width: '39%' },

        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
            { label: 'Категория', field: 'ProductTargetCategoryId', type: 'dropdown', endpoint: 'api/Entities/Position/Filter', visible: true },
        ],
    },
    {
        typeId: '103825',
        endpoint: 'api/Entities/Cargo',
        pageTitle: 'Грузы',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '33%' },
            { label: 'Наименование', field: 'cargoName', type: 'string', width: '33%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'cargoName', type: 'text', visible: true },
        ],
    },
    {
        typeId: '924684',
        endpoint: 'api/Entities/Storage',
        pageTitle: 'Категории назначений товаров',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '10%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '49%' },
            { label: 'Краткое наименование', field: 'shortName', type: 'string', width: '49%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
            { label: 'Краткое наименование', field: 'shortName', type: 'text', visible: true },
        ],
    },

    {
        typeId: '174208',
        endpoint: 'api/Entities/MiningQuarry',
        pageTitle: 'Карьеры',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '49%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '49%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
        ],
    },

    {
        typeId: '592034',
        endpoint: 'api/Entities/StorageArea',
        pageTitle: 'Хранилище',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '49%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '49%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
        ],
    },

    {
        typeId: '193452',
        endpoint: 'api/Entities/DriverEmployee',
        pageTitle: 'Водители',
        tableColumns: [
            { label: 'Фамилия', field: 'surname', type: 'string', width: '49%' },
            { label: 'Имя', field: 'name', type: 'string', width: '49%' },
            { label: 'Отчество', field: 'patronymic', type: 'string', width: '49%' },

        ],
        formFields: [
            { label: 'Фамилия', field: 'surname', type: 'string', width: '49%' },
            { label: 'Имя', field: 'name', type: 'text', visible: true },
            { label: 'Отчество', field: 'patronymic', type: 'text', visible: true },
        ],
    },

];