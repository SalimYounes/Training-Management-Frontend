import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Participant } from '../Entité/Participant.module';

@Component({
  selector: 'app-list-participant',
  templateUrl: './list-participant.component.html',
  styleUrls: ['./list-participant.component.css']
})
export class ListParticipantComponent implements OnInit {
  listParticipant: Participant[] = [];
  p: number = 1;

  constructor(private service: CrudserviceService, private router: Router) { }

  ngOnInit(): void {
    this.service.getParticipants().subscribe(participants => {
      this.listParticipant = participants;
    });
  }

  // Supprimer un participant
  deleteParticipant(participant: Participant): void {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: 'Vous ne pourrez pas annuler cette action !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.onDeleteParticipant(participant.id).subscribe(() => {
          Swal.fire({
            title: 'Supprimé !',
            text: 'Votre participant a été supprimé.',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }
}
