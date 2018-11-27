import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RecordService } from './record.service';
import { RecordMockService } from './record.mock.service';
import { EditorData } from '../../shared/interfaces/editor-data.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class RecordResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private recordService: RecordService,
    private recordMockService: RecordMockService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<EditorData> {
    if (route.queryParams.url) {
      return this.recordService.fetchData(route.queryParams.url);
    } else if (!environment.production) {
      return this.recordMockService.getMockData();
    }
    this.router.navigate(['/404']);
    return Observable.of();
  }
}
