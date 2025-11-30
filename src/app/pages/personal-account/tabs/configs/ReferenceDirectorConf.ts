export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'api/Entities/Driver',
        pageTitle: 'Водители',
        tableColumns: [
            { label: 'Фамилия', field: 'lastName', type: 'string', width: '20%' },
            { label: 'Имя', field: 'firstName', type: 'string', width: '15%' },
            { label: 'Отчество', field: 'middleName', type: 'string', width: '15%' },
            { label: 'Ставка', field: 'rate', type: 'number', width: '15%' },
            { label: 'Телефон', field: 'phoneNumber', type: 'string', width: '15%' },
            { label: 'Email', field: 'email', type: 'string', width: '20%' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text', required: true, visible: true },
            { label: 'Имя', field: 'firstName', type: 'text', required: true, visible: true },
            { label: 'Отчество', field: 'middleName', type: 'text', required: false, visible: true },
            { label: 'Ставка', field: 'rate', type: 'number', required: true, visible: true },
            { label: 'Дата рождения', field: 'birthday', type: 'date', required: false, visible: true },
            { label: 'Телефон', field: 'phoneNumber', type: 'text', required: false, visible: true },
            // { label: 'Email', field: 'email', type: 'email', required: false, visible: true },
            // { label: 'Статус', field: 'status', type: 'text', required: false, visible: true },
            // { label: 'Транспортная компания', field: 'transportCompany', type: 'text', required: false, visible: true },
            // { label: 'Тариф', field: 'tariff', type: 'text', required: false, visible: true },
            // { label: 'ID аватара', field: 'avatarId', type: 'text', required: false, visible: false },
            // { label: 'URL аватара', field: 'avatarURL', type: 'text', required: false, visible: false },
        ]
    },

    {
        typeId: '592034',
        endpoint: 'api/Entities/Partner',
        pageTitle: 'Контрагенты',
        tableColumns: [
            { label: 'Краткое название', field: 'shortName', type: 'string', width: '20%' },
            { label: 'Полное название', field: 'fullName', type: 'string', width: '25%' },
            { label: 'ИНН', field: 'inn', type: 'string', width: '12%' },
            { label: 'КПП', field: 'kpp', type: 'string', width: '12%' },
            { label: 'Контактное лицо', field: 'lastName', type: 'string', width: '15%' },
            { label: 'Телефон', field: 'phoneNumber', type: 'string', width: '16%' },
        ],
        formFields: [
            { label: 'Краткое название', field: 'shortName', type: 'text', required: true, visible: true },
            { label: 'Полное название', field: 'fullName', type: 'text', required: true, visible: true },
            { label: 'ИНН', field: 'inn', type: 'text', required: true, visible: true },
            { label: 'КПП', field: 'kpp', type: 'text', required: false, visible: true },
            { label: 'ОГРН', field: 'ogrn', type: 'text', required: false, visible: true },
            { label: 'Корреспондентский счет', field: 'korAccount', type: 'text', required: false, visible: true },
            { label: 'Фамилия', field: 'lastName', type: 'text', required: false, visible: true },
            { label: 'Имя', field: 'firstName', type: 'text', required: false, visible: true },
            { label: 'Отчество', field: 'middleName', type: 'text', required: false, visible: true },
            { label: 'Направление деятельности', field: 'workDirection', type: 'text', required: false, visible: true },
            { label: 'Телефон', field: 'phoneNumber', type: 'text', required: false, visible: true },
            { label: 'Email', field: 'email', type: 'email', required: false, visible: true },
            { label: 'Адрес', field: 'address', type: 'text', required: false, visible: true },
            { label: 'Тип контрагента', field: 'partnerType', type: 'text', required: false, visible: true },
        ],
        actions: {
            create: {
                endpoint: 'api/Entities/Partner',
                method: 'POST'
            },
            update: {
                endpoint: 'api/Entities/Partner/{id}',
                method: 'PUT'
            },
            delete: {
                endpoint: 'api/Entities/Partner/{id}',
                method: 'DELETE'
            }
        }
    },
    {
        typeId: '915825',
        endpoint: 'api/Entities/Tariff',
        pageTitle: 'Тарифы',
        tableColumns: [
            { label: 'Тип транспорта', field: 'vehicleType', type: 'string', width: '20%' },
            { label: 'Город', field: 'city', type: 'string', width: '20%' },
            { label: 'Единица измерения', field: 'unit', type: 'string', width: '15%' },
            { label: 'Тип кузова', field: 'bodyType', type: 'string', width: '15%' },
            { label: 'Мин. оплата', field: 'minPayment', type: 'number', width: '10%' },
            { label: 'Мин. объем', field: 'minVolume', type: 'number', width: '10%' },
            { label: 'Макс. объем', field: 'maxVolume', type: 'number', width: '10%' },
        ],
        formFields: [
            { label: 'Тип транспорта', field: 'vehicleType', type: 'text', required: true, visible: true },
            { label: 'Город', field: 'city', type: 'text', required: true, visible: true },
            { label: 'Единица измерения', field: 'unit', type: 'text', required: true, visible: true },
            { label: 'Минимальная оплата', field: 'minPayment', type: 'number', required: true, visible: true, min: 0 },
            { label: 'Минимальный объем', field: 'minVolume', type: 'number', required: true, visible: true, min: 0 },
            { label: 'Максимальный объем', field: 'maxVolume', type: 'number', required: true, visible: true, min: 0 },
            { label: 'Тип кузова', field: 'bodyType', type: 'text', required: false, visible: true },
            { label: 'Описание', field: 'description', type: 'text', required: false, visible: true },
        ]
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
            { label: 'Категория', field: 'ProductTargetCategoryId', type: 'dropdown', endpoint: 'api/Entities/ProductTargetCategory/Filter', visible: true },
        ],
    }
];