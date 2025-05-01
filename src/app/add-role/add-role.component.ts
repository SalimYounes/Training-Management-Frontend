import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Role } from '../Entité/Role.module';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      nom: ['', Validators.required]
    });
  }

  get nom() {
    return this.roleForm.get('nom');
  }

  ngOnInit(): void {}

  addRole() {
    if (this.roleForm.invalid) {
      this.toast.info({ detail: 'Erreur', summary: 'Le nom du rôle est obligatoire' });
      return;
    }

    const role = new Role(undefined, this.roleForm.value.nom);

    this.service.addRole(role).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Rôle ajouté avec succès' });
        this.router.navigate(['/listerole']);
      },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur serveur ou rôle déjà existant' });
        console.error(err);
      }
    });
  }
}
