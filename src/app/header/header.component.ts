import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CrudserviceService } from '../service/crudservice.service'; // <<== Important : on injecte ton service

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  nom: string = '';
  prenom: string = '';
  role: string = '';

  constructor(
    private router: Router,
    private service: CrudserviceService // <<== Injecte ton service ici
  ) {}

  ngOnInit(): void {
    this.nom = localStorage.getItem('nom') || '';
    this.prenom = localStorage.getItem('prenom') || '';
    this.role = localStorage.getItem('roleName') || '';
  }

  logout() {
    Swal.fire({
      title: "Déconnexion",
      text: "Veux-tu vraiment te déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.logoutFromServer().subscribe({
          next: (res) => {
            console.log('Déconnecté côté serveur');

            // Nettoyage localStorage
            localStorage.clear();

            this.router.navigate(['/login']).then(() => {
              Swal.fire('Déconnecté !', 'Tu as été déconnecté avec succès.', 'success');
            });
          },
          error: (err) => {
            console.error('Erreur lors du logout serveur', err);

            // Même en cas d'erreur serveur, on nettoie
            localStorage.clear();

            this.router.navigate(['/login']).then(() => {
              Swal.fire('Déconnecté !', 'Tu as été déconnecté avec succès.', 'success');
            });
          }
        });
      }
    });
  }
}
