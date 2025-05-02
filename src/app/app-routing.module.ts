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

import { AddDomaineComponent } from './add-domaine/add-domaine.component';
import { ListDomaineComponent } from './list-domaine/list-domaine.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { ListroleComponent } from './listrole/listrole.component';

import { AuthComponent } from './auth/auth.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './guards/auth.guards';
import { RegistreComponent } from './registre/registre.component';

import { UpdateUserComponent } from './update-user/update-user.component';
import { UpdateStructureComponent } from './update-structure/update-structure.component';
import { UpdateFormateurComponent } from './update-formateur/update-formateur.component';
import { UpdateFormationComponent } from './update-formation/update-formation.component';
import { UpdateParticipantComponent } from './update-participant/update-participant.component';
import { UpdateDomaineComponent } from './update-domaine/update-domaine.component';
import { UpdateEmployeurComponent } from './update-employeur/update-employeur.component';
import { AddProfilComponent } from './add-profil/add-profil.component';
import { ListProfilComponent } from './list-profil/list-profil.component';
import { UpdateProfilComponent } from './update-profil/update-profil.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  { path: 'home', component: HomeComponent,  canActivate: [AuthGuard] },


  { path: 'adduser', component: AdduserComponent,  canActivate: [AuthGuard] },
  { path: 'listuser', component: ListuserComponent, canActivate: [AuthGuard] },
  { path: 'updateuser/:id', component: UpdateUserComponent ,canActivate: [AuthGuard] },


  { path: 'addemployeur', component: AddEmployeurComponent, canActivate: [AuthGuard] },
  { path: 'listemployeur', component: ListEmployeurComponent, canActivate: [AuthGuard] },
  {path: 'updateEmployeur/:id',component: UpdateEmployeurComponent, canActivate:[AuthGuard]},

  { path: 'addformateur', component: AddFormateurComponent, canActivate: [AuthGuard] },
  { path: 'listformateur', component: ListFormateurComponent, canActivate: [AuthGuard] },
  {path: 'updateFormateur/:id', component: UpdateFormateurComponent ,canActivate: [AuthGuard]},


  { path: 'addformation', component: AddFormationComponent,  canActivate: [AuthGuard] },
  { path: 'listformation', component: ListFormationComponent,  canActivate: [AuthGuard] },
  {path:'updateFormation/:id',component:UpdateFormationComponent  ,canActivate: [AuthGuard]},



  { path: 'addparticipant', component: AddParticipantComponent, canActivate: [AuthGuard] },
  { path: 'listparticipant', component: ListParticipantComponent, canActivate: [AuthGuard] },
  {path: 'updateParticipant/:id', component: UpdateParticipantComponent ,canActivate: [AuthGuard]},


  { path: 'addstructure', component: AddStructureComponent, canActivate: [AuthGuard] },
  { path: 'liststructure', component: ListStructureComponent, canActivate: [AuthGuard] },
  { path: 'updateStructure/:id', component: UpdateStructureComponent ,canActivate: [AuthGuard]},


   {path: 'addprofil',component:AddProfilComponent, canActivate:[AuthGuard]},
   {path: 'listprofil',component:ListProfilComponent, canActivate:[AuthGuard]},
   {path: 'updateProfil/:id',component:UpdateProfilComponent,canActivate:[AuthGuard]},



  { path: 'profil', component: ProfilComponent,  canActivate: [AuthGuard] },


  { path: 'adddomaine', component: AddDomaineComponent, canActivate: [AuthGuard] },
  { path: 'listdomaine', component: ListDomaineComponent, canActivate: [AuthGuard] },
  {path: 'updateDomaine/:id',component:UpdateDomaineComponent},

  


  { path: 'addrole', component: AddRoleComponent, canActivate: [AuthGuard] },
  { path: 'listrole', component: ListroleComponent, canActivate: [AuthGuard] },

  { path: 'login', component: AuthComponent }, 
  { path: 'register', component: RegistreComponent }, 


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 