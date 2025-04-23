import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  /*
  header:Contact[];
  totalContacts:number=0;
  userDetails:any;
  constructor(private router:Router,private service:CrudserviceService) { 
    this.userDetails = this.service.userDetails();
  }

  ngOnInit(): void {
    console.log(this.userDetails);

    this.service.getContact().subscribe(Contact =>{
      this.totalContacts=Contact.length})
      this.service.getContact().subscribe(Contact => {
        this.header = Contact})
  }
    

    
  
  logout(){
    console.log("logout");
    localStorage.clear()
   
    this.router.navigate(['/login']);
    

    
    
    
  }

  getLastFiveContacts(): any[] {
    if (this.header.length > 5) {
      return this.header.slice(this.header.length - 5, this.header.length).reverse();
    } else {
      return this.header.slice().reverse(); // Si moins de 5 contacts, affiche-les tous
    }
  }
  
  */

}
