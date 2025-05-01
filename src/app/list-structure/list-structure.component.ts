import { Component } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Structure } from '../Entité/Structure.module';

@Component({
  selector: 'app-liststructure',
  templateUrl: './list-structure.component.html',
  styleUrls: ['./list-structure.component.css']
})
export class ListStructureComponent {
  listStructure: Structure[];
  p: number = 1;

  constructor(private service: CrudserviceService, private router: Router) {}

  DeleteStructure(structure: Structure) {
    Swal.fire({
      title: "Êtes-vous sûr(e) ?",
      text: "Cette structure sera supprimée définitivement !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.onDeleteStructure(structure.id).subscribe(() => {
          Swal.fire("Supprimé !", "La structure a été supprimée.", "success").then(() => {
            window.location.reload();
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.service.getStructures().subscribe(structures => {
      this.listStructure = structures;
    });
  }
}
