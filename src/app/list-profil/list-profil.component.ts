import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Profil } from '../Entité/Profil.module';

@Component({
  selector: 'app-listprofil',
  templateUrl: './list-profil.component.html',
  styleUrls: ['./list-profil.component.css']
})
export class ListProfilComponent implements OnInit {
  listProfil: Profil[] = [];
  p: number = 1;

  constructor(
    private service: CrudserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getProfils().subscribe(profils => {
      console.log("Liste des profils :", profils);
      this.listProfil = profils;
    });
  }

  DeleteProfil(profil: Profil) {
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
        this.service.onDeleteProfil(profil.id).subscribe(() => {
          Swal.fire({
            title: "Supprimé !",
            text: "Le profil a été supprimé.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }
}
