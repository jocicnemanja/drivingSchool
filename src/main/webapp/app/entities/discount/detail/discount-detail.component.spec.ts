import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DiscountDetailComponent } from './discount-detail.component';

describe('Discount Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: DiscountDetailComponent,
              resolve: { discount: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(DiscountDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load discount on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', DiscountDetailComponent);

      // THEN
      expect(instance.discount).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
