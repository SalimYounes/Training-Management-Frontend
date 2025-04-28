import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../Entité/User.module';
import { Role } from '../Entité/Role.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  updateForm: FormGroup;
  userDetails: any;
  id: string;
  roleName: string = '';
  
  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {
    this.userDetails = this.service.userDetails();
    this.updateForm = this.fb.group({
      nom: [this.userDetails?.nom || '', [
        Validators.required,
        Validators.pattern("[a-z A-Z .'-]+"),
        Validators.minLength(4),
      ]],
      prenom: [this.userDetails?.prenom || '', [Validators.required]],
      email: [this.userDetails?.email || '', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [Validators.required]]
      // Note: We don't include role in the form since it's usually not editable by users
    });
    
    // Initialize the role name
    this.roleName = localStorage.getItem('roleName') || '';
  }
  
  get nom() { return this.updateForm.get('nom'); }
  get prenom() { return this.updateForm.get('prenom'); }
  get email() { return this.updateForm.get('email'); }
  get password() { return this.updateForm.get('password'); }
  
  ngOnInit(): void {
    this.id = this.userDetails?.id;
    if (this.id) {
      this.service.findUserById(this.id).subscribe(
        (user: User) => {
          this.updateForm.patchValue({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email
          });
          
          // Store the role name for display
          this.roleName = user.role?.nom || '';
        },
        error => {
          this.toast.error({
            detail: 'Erreur',
            summary: 'Impossible de récupérer les informations utilisateur.'
          });
        }
      );
    }
  }
  
  updateProfile() {
    if (this.updateForm.invalid) {
      this.toast.info({
        detail: 'Error Message',
        summary: 'Veuillez remplir correctement les champs obligatoires',
      });
      return;
    }
    
    const formData = this.updateForm.value;
    // Create a Role object for the user
    const userRole = this.userDetails?.role ? 
      new Role(this.userDetails.role.id, this.userDetails.role.nom) : 
      undefined;
    
    const user = new User(
      this.id,
      formData.nom,
      formData.prenom,
      formData.email,
      formData.password,
      userRole // Pass the existing role object
    );
    
    this.service.updateUser(this.id, user).subscribe({
      next: (res: any) => {
        // Mettre à jour le token si un nouveau est retourné
        if (res.token) {
          localStorage.setItem('myToken', res.token);
        }
        // Mettre à jour les informations dans le localStorage
        localStorage.setItem('nom', user.nom || '');
        localStorage.setItem('prenom', user.prenom || '');
        localStorage.setItem('email', user.email || '');
        // Do not update roleName in localStorage as we're not changing it
        
        this.toast.success({
          detail: 'Succès',
          summary: 'Votre profil a été mis à jour avec succès',
        });
        this.router.navigate(['/profil']).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.toast.error({
          detail: 'Erreur',
          summary: error.status === 400 ? 'Données invalides' : 'Erreur serveur',
        });
      }
    });
  }
}