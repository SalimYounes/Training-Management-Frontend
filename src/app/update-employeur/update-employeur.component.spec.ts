import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeurComponent } from './update-employeur.component';

describe('UpdateEmployeurComponent', () => {
  let component: UpdateEmployeurComponent;
  let fixture: ComponentFixture<UpdateEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEmployeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
