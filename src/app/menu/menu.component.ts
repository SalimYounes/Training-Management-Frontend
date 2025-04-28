// src/app/menu/menu.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  roleName: string = '';
  
  constructor() { }
  
  ngOnInit(): void {
    // Récupérer le rôle de l'utilisateur depuis le localStorage
    this.roleName = localStorage.getItem('roleName') || '';
  }
  
  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    return this.roleName === role;
  }
  
  // Vérifier si l'utilisateur est un utilisateur simple (ni admin, ni responsable)
  isSimpleUser(): boolean {
    return this.roleName !== 'Administrateur' && this.roleName !== 'Responsable';
  }
}