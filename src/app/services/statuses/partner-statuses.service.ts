import { Injectable } from '@angular/core';

export enum EditStatusEnum {
  Undefined = 0,
  New = 1,
  Updated = 2,
  Deleted = 3,
  NewRejected = 4,
  UpdateRejected = 5,
  DeleteRejected = 6,
  Approve = 7,
  NotActive = 8,
  Active = 9
}

@Injectable({
  providedIn: 'root'
})
export class PartnerStatusService {
  private readonly statusLabels: Record<number, string> = {
    [EditStatusEnum.New]: 'Новый',
    [EditStatusEnum.Updated]: 'Измененный',
    [EditStatusEnum.Deleted]: 'Удален',
    [EditStatusEnum.NewRejected]: 'Отклонено',
    [EditStatusEnum.Approve]: 'Подтвержден',
    [EditStatusEnum.NotActive]: 'Неактивный'
  };

  private readonly statusClasses: Record<number, string> = {
    [EditStatusEnum.New]: 'new',
    [EditStatusEnum.Updated]: 'updated',
    [EditStatusEnum.Deleted]: 'deleted',
    [EditStatusEnum.NewRejected]: 'rejected',
    [EditStatusEnum.Approve]: 'approved',
    [EditStatusEnum.NotActive]: 'not-active'
  };

  private readonly editableStatuses = new Set([
    EditStatusEnum.New,
    EditStatusEnum.NewRejected,
    EditStatusEnum.UpdateRejected,
    EditStatusEnum.DeleteRejected,
    EditStatusEnum.Active,
    EditStatusEnum.Approve
  ]);

  private readonly forbiddenStatuses = new Set([
    EditStatusEnum.Updated,
    EditStatusEnum.Deleted,
    EditStatusEnum.NotActive
  ]);

  constructor() {}

  isEditable(status: number): boolean {
    return this.editableStatuses.has(status);
  }

  getStatusLabel(status: number): string {
    return this.statusLabels[status] || 'Неизвестный статус';
  }

  getStatusClass(status: number): string {
    return this.statusClasses[status] || 'unknown';
  }

  isForbiddenStatus(status: number): boolean {
    return this.forbiddenStatuses.has(status);
  }


  sortByStatus(counterparties: any[]): any[] {
    return [...counterparties].sort((a, b) => {
      const isAForbidden = this.isForbiddenStatus(a.editStatus) ? 1 : 0;
      const isBForbidden = this.isForbiddenStatus(b.editStatus) ? 1 : 0;

      return isAForbidden - isBForbidden || a.editStatus - b.editStatus;
    });
  }
}
