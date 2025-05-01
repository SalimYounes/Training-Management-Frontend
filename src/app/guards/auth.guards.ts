// src/app/guards/auth.guards.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private service: CrudserviceService,) {}

// Dans AuthGuard
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
  const token = localStorage.getItem('myToken');
  
  if (!token) {
    return this.router.createUrlTree(['/login']);
  }
  
  // Utiliser le service pour décoder le token
  const userDetails = this.service.userDetails();
  
  if (!userDetails) {
    return this.router.createUrlTree(['/login']);
  }
  
  const allowedRoles = route.data['roles'] as Array<string>;
  
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  
  if (allowedRoles.includes(userDetails.role) || userDetails.role === 'ADMIN') {
    return true;
  }
  
  // Redirection selon le rôle
  if (userDetails.role === 'MANAGER') {
    return this.router.createUrlTree(['/home']);
  } else {
    return this.router.createUrlTree(['/listformation']);
  }
}
}