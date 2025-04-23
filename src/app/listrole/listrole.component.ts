import { Component, OnInit } from '@angular/core';
import { Role } from '../Entité/Role.module';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listrole',
  templateUrl: './listrole.component.html',
  styleUrls: ['./listrole.component.css']
})
export class ListroleComponent  implements  OnInit{

  listRole: Role[] = [];
  p: number = 1;

  constructor(private service: CrudserviceService, private router: Router) {}

  ngOnInit(): void {
    this.service.getRoles().subscribe(role => {
      console.log("Liste des rôles :", role);
      this.listRole = role;
    });
  }

  DeleteRole(role: Role) {
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
        this.service.onDeleteRole(role.id).subscribe(() => {
          Swal.fire({
            title: "Supprimé !",
            text: "Le rôle a été supprimé.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }
}
