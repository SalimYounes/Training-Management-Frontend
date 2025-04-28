// src/app/guards/auth.guards.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('myToken');
    
    // Vérifier si l'utilisateur est connecté
    if (!token) {
      return this.router.createUrlTree(['/login']);
    }
    
    // Récupérer le rôle de l'utilisateur
    const roleName = localStorage.getItem('roleName');
    
    // Récupérer les rôles autorisés pour la route actuelle
    const allowedRoles = route.data['roles'] as Array<string>;
    
    // Si aucun rôle n'est spécifié pour cette route, n'importe quel utilisateur connecté peut y accéder
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    
    // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
    if (roleName && (allowedRoles.includes(roleName) || roleName === 'Administrateurs')) {
      return true;
    }
    
    // Gérer les redirections selon le rôle
    if (roleName === 'Responsable') {
      // Le Responsable est redirigé vers la page home s'il n'a pas accès
      return this.router.createUrlTree(['/home']);
    } else if (roleName !== 'Administrateurs') {
      // L'utilisateur simple est redirigé vers la liste des formations s'il n'a pas accès
      return this.router.createUrlTree(['/listformation']);
    }
    
    // Par défaut, rediriger vers login
    return this.router.createUrlTree(['/login']);
  }
}