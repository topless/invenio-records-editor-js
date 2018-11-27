import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { RecordResolver } from './shared/services/record.resolver';

const appRoutes: Routes = [
  {
    path: '',
    component: EditorComponent,
    resolve: { editorData: RecordResolver },
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRouter {}
