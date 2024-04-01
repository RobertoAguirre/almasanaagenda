import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapeutasComponent } from './terapeutas.component';

describe('TerapeutasComponent', () => {
  let component: TerapeutasComponent;
  let fixture: ComponentFixture<TerapeutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerapeutasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerapeutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
