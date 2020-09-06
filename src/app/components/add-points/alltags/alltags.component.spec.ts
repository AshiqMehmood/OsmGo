import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlltagsComponent } from './alltags.component';

describe('AlltagsComponent', () => {
  let component: AlltagsComponent;
  let fixture: ComponentFixture<AlltagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlltagsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlltagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
