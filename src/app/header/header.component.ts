import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CrudserviceService } from '../service/crudservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private service: CrudserviceService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.currentUser = this.service.userDetails();
    
    // Fallback pour la compatibilité avec l'ancien système
    if (!this.currentUser) {
      this.currentUser = {
        nom: localStorage.getItem('nom') || '',
        prenom: localStorage.getItem('prenom') || '',
        role: localStorage.getItem('roleName') || ''
      };
    }
  }

  logout(): void {
    Swal.fire({
      title: "Déconnexion",
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
      backdrop: `
        rgba(64, 69, 58, 0.4)
        url("/assets/images/cat-nyan-cat.gif")
        left top
        no-repeat
      `
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        
        this.service.logoutFromServer().subscribe({
          next: () => this.handleLogoutSuccess(),
          error: (err) => this.handleLogoutError(err)
        });
      }
    });
  }

  private handleLogoutSuccess(): void {
    this.cleanUpAndNavigate();
    Swal.fire({
      title: 'Déconnecté!',
      text: 'Vous avez été déconnecté avec succès.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }

  private handleLogoutError(error: any): void {
    console.error('Erreur lors de la déconnexion:', error);
    this.cleanUpAndNavigate();
    Swal.fire({
      title: 'Déconnecté',
      text: 'La session a été fermée localement.',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    });
  }

  private cleanUpAndNavigate(): void {
    // Nettoyage complet
    localStorage.clear();
    sessionStorage.clear();
    
    // Réinitialisation des données utilisateur
    this.currentUser = null;
    this.isLoading = false;
    
    // Redirection
    this.router.navigate(['/login']);
  }

  get userInitials(): string {
    if (this.currentUser?.prenom && this.currentUser?.nom) {
      return `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`.toUpperCase();
    }
    return '?';
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }
}