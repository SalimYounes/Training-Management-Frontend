import { Component } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Formation } from '../Entité/Formation.module';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-formation',
  templateUrl: './list-formation.component.html',
  styleUrls: ['./list-formation.component.css']
})
export class ListFormationComponent {

  listFormation: Formation[] = [];
  p: number = 1;

  constructor(private service: CrudserviceService) {}

  ngOnInit(): void {
    this.service.getFormations().subscribe(formations => {
      console.log("Liste des formations :", formations);
      this.listFormation = formations;
    });
  }

  deleteFormation(formation: Formation): void {
    Swal.fire({
      title: "Êtes-vous sûr(e) ?",
      text: "Cette formation sera supprimée définitivement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !"
    }).then(result => {
      if (result.isConfirmed) {
        this.service.onDeleteFormation(formation.id).subscribe(() => {
          Swal.fire("Supprimée !", "La formation a été supprimée.", "success").then(() => {
            this.ngOnInit(); // recharge la liste
          });
        });
      }
    });
  }

}
