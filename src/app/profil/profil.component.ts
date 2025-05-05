import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../Entité/User.module';
import { Roles } from '../Entité/Roles.module'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  updateForm: FormGroup;
  currentUser: any;
  roleName: string = '';
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {
    this.currentUser = this.service.userDetails();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.updateForm = this.fb.group({
      nom: [this.currentUser?.nom || '', [
        Validators.required,
        Validators.pattern("[a-z A-Z .'-]+"),
        Validators.minLength(4),
      ]],
      prenom: [this.currentUser?.prenom || '', [Validators.required]],
      email: [this.currentUser?.email || '', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]]
    });
  }

  get nom() { return this.updateForm.get('nom'); }
  get prenom() { return this.updateForm.get('prenom'); } // ✅ correction ici (username -> prenom)
  get email() { return this.updateForm.get('email'); }
  get password() { return this.updateForm.get('password'); }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserDetails();
  }

  private loadUserDetails(): void {
    this.service.findUserById(this.currentUser.id).subscribe({
      next: (user: User) => {
        this.currentUser = { ...this.currentUser, ...user };
        this.roleName = this.currentUser.role || Roles.SIMPLE; // ✅ rôle en texte, default = SIMPLE
        this.updateForm.patchValue({
          nom: this.currentUser.nom,
          prenom: this.currentUser.prenom,
          email: this.currentUser.email
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error({
          detail: 'Erreur',
          summary: 'Impossible de récupérer les informations utilisateur.'
        });
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.toast.info({
        detail: 'Message d\'erreur',
        summary: 'Veuillez remplir correctement les champs obligatoires',
        duration: 5000
      });
      return;
    }

    const formData = this.updateForm.value;

    const user = new User(
      this.currentUser.id,
      formData.nom,
      formData.prenom,
      formData.email,
      formData.password || undefined, // ✅ Ne pas envoyer le password si non modifié
      this.currentUser.role // ✅ ici c’est une string de type Roles
    );

    this.isLoading = true;
    this.service.updateUser(this.currentUser.id, user).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('myToken', res.token);
        }

        this.toast.success({
          detail: 'Succès',
          summary: 'Profil mis à jour avec succès',
          duration: 3000
        });

        this.currentUser = this.service.userDetails();
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error({
          detail: 'Erreur',
          summary: error.error?.message || 'Erreur lors de la mise à jour',
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
