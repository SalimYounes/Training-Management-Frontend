import { Component } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../Entité/User.module';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.css']
})
export class ListuserComponent {
  role:String
  listUser: User[];
  p:number=1;
  collection:any[]
 
  constructor(private service:CrudserviceService,private router:Router ) { }


  //supprimer
  Deleteuser(user: User) {
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
        this.service.onDeleteUser(user.id).subscribe(() => {  
          Swal.fire({
            title: "Supprimé !",
            text: "Votre User a été supprimé.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }


  ngOnInit(): void {
    this.service.getUser().subscribe(user => {
      console.log("Liste des utilisateurs :", user);
      this.listUser = user;
    });
  }
  

  

}
