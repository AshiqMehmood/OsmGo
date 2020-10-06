import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommontagsComponent } from './commontags.component';

describe('CommontagsComponent', () => {
  let component: CommontagsComponent;
  let fixture: ComponentFixture<CommontagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommontagsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommontagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
