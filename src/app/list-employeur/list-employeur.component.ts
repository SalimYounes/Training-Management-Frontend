import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Employeur } from '../Entité/Employeur.module';

@Component({
  selector: 'app-listemployeur',
  templateUrl: './list-employeur.component.html',
  styleUrls: ['./list-employeur.component.css']
})
export class ListEmployeurComponent implements OnInit {
  listEmployeur: Employeur[] = [];
  p: number = 1;

  constructor(private service: CrudserviceService, private router: Router) {}

  ngOnInit(): void {
    this.service.getEmployeurs().subscribe(employeurs => {
      console.log("Liste des employeurs :", employeurs);
      this.listEmployeur = employeurs;
    });
  }

  deleteEmployeur(employeur: Employeur) {
    Swal.fire({
      title: "Êtes-vous sûr(e) ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.onDeleteEmployeur(employeur.id).subscribe(() => {
          Swal.fire({
            title: "Supprimé !",
            text: "L'employeur a été supprimé.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }
}
