import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Participant } from '../Entité/Participant.module';

@Component({
  selector: 'app-update-participant',
  templateUrl: './update-participant.component.html',
  styleUrls: ['./update-participant.component.css']
})
export class UpdateParticipantComponent implements OnInit {

  updateForm: FormGroup;
  id: string;
  structures: any[] = [];
  profils: any[] = [];
  formations: any[] = [];

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
      structure: [null, Validators.required],
      profil: [null, Validators.required],
      formations: [[]]  // Liste multiple de formations
    });
  }

  get nom() { return this.updateForm.get('nom'); }
  get prenom() { return this.updateForm.get('prenom'); }
  get email() { return this.updateForm.get('email'); }
  get tel() { return this.updateForm.get('tel'); }
  get structure() { return this.updateForm.get('structure'); }
  get profil() { return this.updateForm.get('profil'); }
  get formationsCtrl() { return this.updateForm.get('formations'); }

  ngOnInit(): void {
    let idParticipant = this.router.snapshot.params['id'];
    this.id = idParticipant;

    // Charger structures
    this.service.getStructures().subscribe({
      next: (data) => { this.structures = data; },
      error: () => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement structures' });
      }
    });

    // Charger profils
    this.service.getProfils().subscribe({
      next: (data) => { this.profils = data; },
      error: () => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement profils' });
      }
    });

    // Charger formations
    this.service.getFormations().subscribe({
      next: (data) => { this.formations = data; },
      error: () => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement formations' });
      }
    });

    // Charger participant
    this.service.findParticipantById(idParticipant).subscribe({
      next: (participant) => {
        this.updateForm.patchValue({
          nom: participant.nom,
          prenom: participant.prenom,
          email: participant.email,
          tel: participant.tel,
          structure: participant.structure?.id,
          profil: participant.profil?.id,
          formations: participant.formations?.map((f: any) => f.id) || []
        });
      },
      error: (err) => {
        console.error('Erreur chargement participant:', err);
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement participant' });
        this.route.navigate(['/listparticipant']);
      }
    });
  }

  updateParticipant() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs',
      });
      return;
    }

    const formData = this.updateForm.value;

    const selectedStructure = this.structures.find(s => s.id === formData.structure);
    const selectedProfil = this.profils.find(p => p.id === formData.profil);
    const selectedFormations = formData.formations.map((idFormation: string) => {
      const formation = this.formations.find(f => f.id === idFormation);
      return formation ? { id: formation.id, titre: formation.titre } : null;
    }).filter((f: any) => f !== null);

    const participantToUpdate: Participant = {
      id: this.id,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      tel: formData.tel,
      structure: selectedStructure ? { id: selectedStructure.id, libelle: selectedStructure.libelle } : undefined,
      profil: selectedProfil ? { id: selectedProfil.id, libelle: selectedProfil.libelle } : undefined,
      formations: selectedFormations
    };

    console.log('Participant à mettre à jour:', JSON.stringify(participantToUpdate, null, 2));

    this.service.updateParticipant(this.id, participantToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Participant mis à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listparticipant']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);

        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Participant non trouvé';
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
