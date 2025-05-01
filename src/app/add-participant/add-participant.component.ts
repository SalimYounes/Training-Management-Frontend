import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      formations: [[], Validators.required] // tableau de sélection
    });

    this.loadRelations();
  }

  loadRelations() {
    this.service.getStructures().subscribe(res => this.structures = res);
    this.service.getProfils().subscribe(res => this.profils = res);
    this.service.getFormations().subscribe(res => this.formations = res);
  }

  addParticipant() {
    if (this.participantForm.invalid) {
      this.toast.warning({ detail: 'Erreur', summary: 'Veuillez remplir tous les champs' });
      return;
    }

    const data = this.participantForm.value;
    const participant = new Participant(
      undefined,
      data.nom,
      data.prenom,
      data.email,
      data.tel,
      data.structure,
      data.profil,
      data.formations
    );

    this.service.addParticipant(participant).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Participant ajouté' });
        this.router.navigate(['/listeparticipant']);
      },
      error: () => {
        this.toast.error({ detail: 'Erreur', summary: 'Échec lors de l\'ajout' });
      }
    });
  }
}
