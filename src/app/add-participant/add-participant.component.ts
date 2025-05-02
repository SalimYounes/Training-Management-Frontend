import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Participant } from '../Entité/Participant.module';
import { Structure } from '../Entité/Structure.module';
import { Profil } from '../Entité/Profil.module';
import { Formation } from '../Entité/Formation.module';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.css']
})
export class AddParticipantComponent implements OnInit {
  participantForm!: FormGroup;
  structures: Structure[] = [];
  profils: Profil[] = [];
  formations: Formation[] = [];

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.participantForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      structure: ['', Validators.required],
      profil: ['', Validators.required],
      formationSelections: this.fb.array([], Validators.required)
    });
    
    this.loadRelations();
  }

  loadRelations() {
    this.service.getStructures().subscribe(res => this.structures = res);
    this.service.getProfils().subscribe(res => this.profils = res);
    this.service.getFormations().subscribe(res => {
      this.formations = res;
      // Initialiser les checkboxes avec des valeurs false
      this.initFormationCheckboxes();
    });
  }

  // Initialise les checkboxes pour chaque formation
  initFormationCheckboxes() {
    const checkArray = this.participantForm.get('formationSelections') as FormArray;
    this.formations.forEach(() => {
      checkArray.push(new FormControl(false));
    });
  }

  // Vérifie si au moins une formation est sélectionnée
  get isFormationSelected() {
    const formationArray = this.participantForm.get('formationSelections') as FormArray;
    return formationArray.controls.some(control => control.value === true);
  }

  addParticipant() {
    if (this.participantForm.invalid || !this.isFormationSelected) {
      this.toast.warning({ detail: 'Erreur', summary: 'Veuillez remplir tous les champs et sélectionner au moins une formation' });
      return;
    }

    const data = this.participantForm.value;
    
    // Récupérer les IDs des formations sélectionnées
    const selectedFormationIds = this.getSelectedFormationIds();
    
    // Préparation des données selon le format attendu par l'API
    const participant = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      tel: data.tel,
      structureId: data.structure, // ID de structure
      profilId: data.profil, // ID de profil
      formationIds: selectedFormationIds // Liste des IDs de formation sélectionnés
    };

    this.service.addParticipant(participant).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Participant ajouté' });
        this.router.navigate(['/listeparticipant']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du participant:', err);
        this.toast.error({ detail: 'Erreur', summary: 'Échec lors de l\'ajout' });
      }
    });
  }

  // Méthode pour récupérer les IDs des formations sélectionnées
  getSelectedFormationIds(): string[] {
    const selectedIds: string[] = [];
    const formationSelections = this.participantForm.get('formationSelections') as FormArray;
    
    formationSelections.controls.forEach((control, index) => {
      if (control.value) {
        selectedIds.push(this.formations[index].id);
      }
    });
    
    return selectedIds;
  }
}