import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeModalComponent } from './welcome-modal.component';

describe('WelcomeModalComponent', () => {
  let component: WelcomeModalComponent;
  let fixture: ComponentFixture<WelcomeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
