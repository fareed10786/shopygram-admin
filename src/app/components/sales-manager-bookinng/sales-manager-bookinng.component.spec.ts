import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesManagerBookinngComponent } from './sales-manager-bookinng.component';

describe('SalesManagerBookinngComponent', () => {
  let component: SalesManagerBookinngComponent;
  let fixture: ComponentFixture<SalesManagerBookinngComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesManagerBookinngComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesManagerBookinngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
