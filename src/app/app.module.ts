import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from'@angular/common/http';
import { NgToastComponent, NgToastModule } from 'ng-angular-popup';

import { NgxPaginationModule } from 'ngx-pagination';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdduserComponent } from './adduser/adduser.component';
import { ListuserComponent } from './listuser/listuser.component';

import { ProfilComponent } from './profil/profil.component';
import { ListroleComponent } from './listrole/listrole.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { ListDomaineComponent } from './list-domaine/list-domaine.component';
import { AddDomaineComponent } from './add-domaine/add-domaine.component';
import { AddFormationComponent } from './add-formation/add-formation.component';
import { ListFormationComponent } from './list-formation/list-formation.component';
import { ListFormateurComponent } from './list-formateur/list-formateur.component';
import { ListEmployeurComponent } from './list-employeur/list-employeur.component';
import { AddEmployeurComponent } from './add-employeur/add-employeur.component';
import { ListStructureComponent } from './list-structure/list-structure.component';
import { AddStructureComponent } from './add-structure/add-structure.component';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { AddProfilComponent } from './add-profil/add-profil.component';
import { ListProfilComponent } from './list-profil/list-profil.component';
import { AddFormateurComponent } from './add-formateur/add-formateur.component';

import { AuthComponent } from './auth/auth.component';
import { RegistreComponent } from './registre/registre.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';


import { ListParticipantComponent } from './list-participant/list-participant.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UpdateStructureComponent } from './update-structure/update-structure.component';
import { UpdateFormateurComponent } from './update-formateur/update-formateur.component';
import { UpdateFormationComponent } from './update-formation/update-formation.component';
import { UpdateParticipantComponent } from './update-participant/update-participant.component';
import { UpdateDomaineComponent } from './update-domaine/update-domaine.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AdduserComponent,
    ListuserComponent,
    ProfilComponent,
    ListroleComponent,
    AddRoleComponent,
    ListDomaineComponent,
    AddDomaineComponent,
    AddFormationComponent,
    ListFormationComponent,
    ListFormateurComponent,
    ListEmployeurComponent,
    AddEmployeurComponent,
    ListStructureComponent,
    AddStructureComponent,
    AddParticipantComponent,
    ListParticipantComponent,
    AddProfilComponent,
    ListProfilComponent,
    AddFormateurComponent,
    AuthComponent,
    RegistreComponent,
    UpdateUserComponent,
    UpdateStructureComponent,
    UpdateFormateurComponent,
    UpdateFormationComponent,
    UpdateParticipantComponent,
    UpdateDomaineComponent,
    UpdateRoleComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
