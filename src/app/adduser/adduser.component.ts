import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../Entité/User.module';
import { Roles } from '../Entité/Roles.module';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  UserForm: FormGroup;

  // Liste des rôles affichables dans le select
  roles = [
    { nom: 'ADMIN', value: Roles.ADMIN },
    { nom: 'SIMPLE', value: Roles.SIMPLE },
    { nom: 'MANAGER', value: Roles.MANAGER }
  ];

  constructor(
    private service: CrudserviceService,
    private router: Router,
    private fb: FormBuilder,
    private toast: NgToastService
  ) {
    this.UserForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  get nom() { return this.UserForm.get('nom'); }
  get prenom() { return this.UserForm.get('prenom'); }
  get email() { return this.UserForm.get('email'); }
  get password() { return this.UserForm.get('password'); }
  get role() { return this.UserForm.get('role'); }

  ngOnInit(): void {
    // plus besoin de charger les rôles depuis le backend
  }

  addNewUser() {
    if (this.UserForm.invalid) {
      this.toast.info({
        detail: 'Erreur',
        summary: 'Tous les champs sont obligatoires',
      });
      return;
    }

    const data = this.UserForm.value;
    const user = new User(undefined, data.nom, data.prenom, data.email, data.password, data.role);

    if (!this.service.validateEmail(data.email)) {
      this.toast.warning({
        detail: 'Erreur',
        summary: 'Veuillez vérifier le format de l\'email',
      });
      return;
    }

    this.service.addUser(user).subscribe({
      next: () => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Utilisateur ajouté avec succès',
        });
        this.router.navigate(['/listuser']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toast.error({
            detail: 'Erreur',
            summary: 'Email existe déjà',
          });
          this.email?.reset();
        } else {
          this.toast.error({
            detail: 'Erreur',
            summary: 'Problème de serveur',
          });
        }
        this.UserForm.reset();
      }
    });
  }
}
