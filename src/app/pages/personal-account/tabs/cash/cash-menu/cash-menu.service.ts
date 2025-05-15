import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashMenuService {

  constructor() { }

  private _someVariable = new BehaviorSubject<any>(true);

  public someVariable$ = this._someVariable.asObservable();

  setSomeVariable(value: any) {
    this._someVariable.next(value);
  }

}
