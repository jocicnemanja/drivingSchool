import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { DocumentsComponent } from './list/documents.component';
import { DocumentsDetailComponent } from './detail/documents-detail.component';
import { DocumentsUpdateComponent } from './update/documents-update.component';
import DocumentsResolve from './route/documents-routing-resolve.service';

const documentsRoute: Routes = [
  {
    path: '',
    component: DocumentsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentsDetailComponent,
    resolve: {
      documents: DocumentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentsUpdateComponent,
    resolve: {
      documents: DocumentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentsUpdateComponent,
    resolve: {
      documents: DocumentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default documentsRoute;
