export interface ButtonConfig {
    label: string;
    action: string;
    titlePopUp?: string;
    messagePopUp?: string;
    status?: number;
    isEditData?: boolean;
    class: string;
    condition?: (product: any) => boolean;
}
