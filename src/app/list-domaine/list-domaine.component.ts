import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Domaine } from '../Entité/Domaine.module';

@Component({
  selector: 'app-listdomaine',
  templateUrl: './list-domaine.component.html',
  styleUrls: ['./list-domaine.component.css']
})
export class ListDomaineComponent implements OnInit {
  listDomaine: Domaine[] = [];
  p: number = 1;

  constructor(private service: CrudserviceService, private router: Router) {}

  ngOnInit(): void {
    this.service.getDomaines().subscribe(domaine => {
      console.log("Liste des domaines :", domaine);
      this.listDomaine = domaine;
    });
  }

  DeleteDomaine(domaine: Domaine) {
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
        this.service.onDeleteDomaine(domaine.id).subscribe(() => {
          Swal.fire({
            title: "Supprimé !",
            text: "Le domaine a été supprimé.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }
}
