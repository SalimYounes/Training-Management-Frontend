import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Formateur } from '../Entité/Formateur.module';

@Component({
  selector: 'app-listformateur',
  templateUrl: './list-formateur.component.html',
  styleUrls: ['./list-formateur.component.css']
})
export class ListFormateurComponent implements OnInit {
  listFormateur: Formateur[] = [];
  p: number = 1;

  constructor(
    private service: CrudserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getFormateurs().subscribe(formateurs => {
      console.log("Liste des formateurs :", formateurs);
      this.listFormateur = formateurs;
    });
  }

  DeleteFormateur(formateur: Formateur) {
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
        this.service.onDeleteFormateur(formateur.id).subscribe(() => {
          Swal.fire({
            title: "Supprimé !",
            text: "Le formateur a été supprimé.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }
}
