import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CurrentUserService } from '../../../services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class DirectorAuthGuard implements CanActivate {

  constructor(private router: Router, private currentUserService: CurrentUserService) {}

  private async hasSupplierRole(user: any): Promise<boolean> {
    return user && user.roles && user.roles[0]?.name === 'Директор';
  }

  private async handleUnauthorisedAccess() {
    this.currentUserService.clearAuthData();
    await this.router.navigate(['/']);
    return false;
  }

  private async getUserAndCheckRole(): Promise<boolean> {
    try {
      const user = await this.currentUserService.getUserData().toPromise();
      return this.hasSupplierRole(user.data);
    } catch {
      return false;
    }
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    const user = this.currentUserService.getUser();

    if (user && await this.hasSupplierRole(user)) {
      return true;
    }

    const isSupplier = user ? false : await this.getUserAndCheckRole();

    return isSupplier || await this.handleUnauthorisedAccess();
  }
}
