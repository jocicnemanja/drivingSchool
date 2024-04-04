import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReportsComponent } from './list/reports.component';
import { ReportsDetailComponent } from './detail/reports-detail.component';
import { ReportsUpdateComponent } from './update/reports-update.component';
import ReportsResolve from './route/reports-routing-resolve.service';

const reportsRoute: Routes = [
  {
    path: '',
    component: ReportsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReportsDetailComponent,
    resolve: {
      reports: ReportsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReportsUpdateComponent,
    resolve: {
      reports: ReportsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReportsUpdateComponent,
    resolve: {
      reports: ReportsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reportsRoute;
