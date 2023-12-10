import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tenant',
        data: { pageTitle: 'drivingSchoolApp.tenant.home.title' },
        loadChildren: () => import('./tenant/tenant.routes'),
      },
      {
        path: 'student',
        data: { pageTitle: 'drivingSchoolApp.student.home.title' },
        loadChildren: () => import('./student/student.routes'),
      },
      {
        path: 'payment',
        data: { pageTitle: 'drivingSchoolApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.routes'),
      },
      {
        path: 'lesson',
        data: { pageTitle: 'drivingSchoolApp.lesson.home.title' },
        loadChildren: () => import('./lesson/lesson.routes'),
      },
      {
        path: 'exam',
        data: { pageTitle: 'drivingSchoolApp.exam.home.title' },
        loadChildren: () => import('./exam/exam.routes'),
      },
      {
        path: 'assurance',
        data: { pageTitle: 'drivingSchoolApp.assurance.home.title' },
        loadChildren: () => import('./assurance/assurance.routes'),
      },
      {
        path: 'discount',
        data: { pageTitle: 'drivingSchoolApp.discount.home.title' },
        loadChildren: () => import('./discount/discount.routes'),
      },
      {
        path: 'documents',
        data: { pageTitle: 'drivingSchoolApp.documents.home.title' },
        loadChildren: () => import('./documents/documents.routes'),
      },
      {
        path: 'reports',
        data: { pageTitle: 'drivingSchoolApp.reports.home.title' },
        loadChildren: () => import('./reports/reports.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
