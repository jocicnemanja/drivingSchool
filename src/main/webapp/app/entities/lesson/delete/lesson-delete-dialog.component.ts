import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILesson } from '../lesson.model';
import { LessonService } from '../service/lesson.service';

@Component({
  standalone: true,
  templateUrl: './lesson-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LessonDeleteDialogComponent {
  lesson?: ILesson;

  constructor(
    protected lessonService: LessonService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lessonService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
