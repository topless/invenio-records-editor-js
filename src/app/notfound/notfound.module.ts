import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { NotFoundComponent } from './notfound.component';

@NgModule({
  imports: [SharedModule],
  declarations: [NotFoundComponent],
})
export class NotFoundModule {}
