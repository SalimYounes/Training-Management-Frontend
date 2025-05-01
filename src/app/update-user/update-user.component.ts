import { Component, OnInit } from '@angular/core';
import { User } from '../Entité/User.module';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Role } from '../Entité/Role.module';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateForm: FormGroup;
  id: string;
  roles: any[] = []; // Pour stocker la liste des rôles disponibles

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private route: Router,
    private router: ActivatedRoute,
    private toast: NgToastService
  ) {
    this.updateForm = this.fb.group({
      nom: ['', [
        Validators.required,
        Validators.pattern("[a-zA-Z '-]+"),
        Validators.minLength(2),
      ]],
      prenom: ['', [
        Validators.required,
        Validators.pattern("[a-zA-Z '-]+"),
        Validators.minLength(2),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      role: [null, [Validators.required]] // Initialisé à null
    });
  }

  // Getters pour les contrôles du formulaire
  get nom() { return this.updateForm.get('nom'); }
  get prenom() { return this.updateForm.get('prenom'); }
  get email() { return this.updateForm.get('email'); }
  get password() { return this.updateForm.get('password'); }
  get role() { return this.updateForm.get('role'); }

  ngOnInit(): void {
    // Charger la liste des rôles disponibles
    this.service.getRoles().subscribe(roles => {
      this.roles = roles;
    });

    // Charger les données de l'utilisateur
    let idUser = this.router.snapshot.params['id'];
    this.id = idUser;
    this.service.findUserById(idUser).subscribe({
      next: (user) => {
        console.log('Utilisateur chargé:', user);
        this.updateForm.patchValue({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          password: '', 
          role: user.role?.id // Stocker seulement l'ID du rôle
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.toast.error({
          detail: 'Erreur',
          summary: 'Échec du chargement des données utilisateur',
        });
        this.route.navigate(['/listuser']);
      }
    });
  }

  updateUser() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs dans le formulaire',
      });
      return;
    }
  
    const formData = this.updateForm.value;
    
    // Find the complete role object based on selected ID
    const selectedRoleId = formData.role;
    const selectedRoleObj = this.roles.find(r => r.id === selectedRoleId);
  
    // Create the user object with the complete role information
    const userToUpdate = {
      id: this.id,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password: formData.password,
      role: {
        id: selectedRoleId,
        nom: selectedRoleObj?.nom
      }
    };
  
    console.log('User à mettre à jour:', JSON.stringify(userToUpdate, null, 2));
  
    this.service.updateUser(this.id, userToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Utilisateur mis à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listuser']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        
        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Utilisateur non trouvé';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
  
        this.toast.error({
          detail: 'Erreur ' + err.status,
          summary: errorMessage,
          duration: 5000
        });
      }
    });
  }
}