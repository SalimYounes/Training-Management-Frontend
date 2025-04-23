import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { HomeComponent } from './home/home.component';
import { AdduserComponent } from './adduser/adduser.component';
import { ListuserComponent } from './listuser/listuser.component';
import { AddEmployeurComponent } from './add-employeur/add-employeur.component';
import { ListEmployeurComponent } from './list-employeur/list-employeur.component';
import { AddFormateurComponent } from './add-formateur/add-formateur.component';
import { ListFormateurComponent } from './list-formateur/list-formateur.component';
import { AddFormationComponent } from './add-formation/add-formation.component';
import { ListFormationComponent } from './list-formation/list-formation.component';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { ListParticipantComponent } from './list-participant/list-participant.component';
import { AddStructureComponent } from './add-structure/add-structure.component';
import { ListStructureComponent } from './list-structure/list-structure.component';
import { AddProfilComponent } from './add-profil/add-profil.component';
import { ListProfilComponent } from './list-profil/list-profil.component';
import { AddDomaineComponent } from './add-domaine/add-domaine.component';
import { ListDomaineComponent } from './list-domaine/list-domaine.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { ListroleComponent } from './listrole/listrole.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Redirige vers /home par défaut
  { path: 'home', component: HomeComponent },

  // Routes pour User
  { path: 'adduser', component: AdduserComponent },
  { path: 'listuser', component: ListuserComponent },

  // Routes pour Employeur
  { path: 'addemployeur', component: AddEmployeurComponent },
  { path: 'listemployeur', component: ListEmployeurComponent },

  // Routes pour Formateur
  { path: 'addformateur', component: AddFormateurComponent },
  { path: 'listformateur', component: ListFormateurComponent },

  // Routes pour Formation
  { path: 'addformation', component: AddFormationComponent },
  { path: 'listformation', component: ListFormationComponent },

  // Routes pour Participant
  { path: 'addparticipant', component: AddParticipantComponent },
  { path: 'listparticipant', component: ListParticipantComponent },

  // Routes pour Structure
  { path: 'addstructure', component: AddStructureComponent },
  { path: 'liststructure', component: ListStructureComponent },

  // Routes pour Profil
  { path: 'addprofil', component: AddProfilComponent },
  { path: 'listprofil', component: ListProfilComponent },

    // Routes pour Domaine
    { path: 'adddomaine', component: AddDomaineComponent },
    { path: 'listdomaine', component: ListDomaineComponent },

       // Routes pour Domaine
       { path: 'addrole', component: AddRoleComponent },
       { path: 'listrole', component: ListroleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
