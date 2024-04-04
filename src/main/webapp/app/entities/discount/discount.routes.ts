import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { DiscountComponent } from './list/discount.component';
import { DiscountDetailComponent } from './detail/discount-detail.component';
import { DiscountUpdateComponent } from './update/discount-update.component';
import DiscountResolve from './route/discount-routing-resolve.service';

const discountRoute: Routes = [
  {
    path: '',
    component: DiscountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiscountDetailComponent,
    resolve: {
      discount: DiscountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiscountUpdateComponent,
    resolve: {
      discount: DiscountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiscountUpdateComponent,
    resolve: {
      discount: DiscountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default discountRoute;
