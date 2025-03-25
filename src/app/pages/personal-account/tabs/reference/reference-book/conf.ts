export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'api/User',
        pageTitle: 'Сотрудники',
        tableColumns: [
            { label: 'Фамилия', field: 'lastName', type: 'string', width: '20%' },
            { label: 'Имя', field: 'firstName' , type: 'string', width: '20%' },
            { label: 'Отчество', field: 'patronymic', type: 'string', width: '20%' },
            { label: 'Должность', field: 'position.name', type: 'string', width: '40%' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text', visible: true },
            { label: 'Имя', field: 'firstName', type: 'text', visible: true },
            { label: 'Отчество', field: 'patronymic', type: 'text', visible: true },
            { label: 'Должность', field: 'positionId', type: 'dropdown', endpoint: 'api/Entities/Position/Filter', visible: true },
            { label: 'Права доступа', field: 'permissionIds', type: 'checkboxes', endpoint: 'api/Entities/Position/Filter', visible: true },
            { label: 'userName', field: 'userName', type: 'text',  visible: false },
            { label: 'email', field: 'email', type: 'text',  visible: false },
            { label: 'password', field: 'password', type: 'text',  visible: false },
            { label: 'isMailSend', field: 'isMailSend', type: 'boolean',  visible: false },
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
            { label: 'Код', field: 'code', type: 'string', width: '33%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '33%' },
            { label: 'Короткое наименование', field: 'shortName', type: 'string', width: '34%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true},
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
            { label: 'Короткое наименование', field: 'shortName', type: 'text', visible: true },
        ],
    },
];
