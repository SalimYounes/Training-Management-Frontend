import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Formateur } from '../Entité/Formateur.module';

@Component({
  selector: 'app-update-formateur',
  templateUrl: './update-formateur.component.html',
  styleUrls: ['./update-formateur.component.css']
})
export class UpdateFormateurComponent implements OnInit {

  updateForm: FormGroup;
  id: string;
  employeurs: any[] = [];
  users: any[] = [];

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
      tel: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{8,15}$")
      ]],
      type: ['', [Validators.required]],
      employeur: [null, Validators.required],
      user: [null, Validators.required]
    });
  }

  get nom() { return this.updateForm.get('nom'); }
  get prenom() { return this.updateForm.get('prenom'); }
  get email() { return this.updateForm.get('email'); }
  get tel() { return this.updateForm.get('tel'); }
  get type() { return this.updateForm.get('type'); }
  get employeur() { return this.updateForm.get('employeur'); }
  get user() { return this.updateForm.get('user'); }

  ngOnInit(): void {
    let idFormateur = this.router.snapshot.params['id'];
    this.id = idFormateur;

    // Charger employeurs
    this.service.getEmployeurs().subscribe({
      next: (data) => { this.employeurs = data; },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement employeurs' });
      }
    });

    // Charger users
    this.service.getUser().subscribe({
      next: (data) => { this.users = data; },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement utilisateurs' });
      }
    });

    // Charger formateur
    this.service.findFormateurById(idFormateur).subscribe({
      next: (formateur) => {
        this.updateForm.patchValue({
          nom: formateur.nom,
          prenom: formateur.prenom,
          email: formateur.email,
          tel: formateur.tel,
          type: formateur.type,
          employeur: formateur.employeur?.id,
          user: formateur.user?.id
        });
      },
      error: (err) => {
        console.error('Erreur chargement formateur:', err);
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement formateur' });
        this.route.navigate(['/listformateur']);
      }
    });
  }

  updateFormateur() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs',
      });
      return;
    }

    const formData = this.updateForm.value;

    const selectedEmployeur = this.employeurs.find(e => e.id === formData.employeur);
    const selectedUser = this.users.find(u => u.id === formData.user);

    const formateurToUpdate: Formateur = {
      id: this.id,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      tel: formData.tel,
      type: formData.type,
      employeur: selectedEmployeur ? { id: selectedEmployeur.id, nomemployeur: selectedEmployeur.nomemployeur } : undefined,
      user: selectedUser ? { id: selectedUser.id, nom: selectedUser.nom, prenom: selectedUser.prenom } : undefined
    };

    console.log('Formateur à mettre à jour:', JSON.stringify(formateurToUpdate, null, 2));

    this.service.updateFormateur(this.id, formateurToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Formateur mis à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listformateur']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        
        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Formateur non trouvé';
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
