import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { Record, PatchRequest } from '../interfaces';
import { isEqual } from 'lodash';

@Injectable()
export class RecordService {
  record: Record;
  record_url: string;
  constructor(private http: Http, private toaster: ToastrService) {}

  private createPatch(new_record): Array<PatchRequest> {
    const operations = [];
    const new_meta = new_record.metadata;
    const old_meta = this.record.metadata;
    for (const prop of Object.keys(new_meta)) {
      if (!old_meta.hasOwnProperty(prop)) {
        operations.push({ op: 'add', path: `/${prop}`, value: new_meta[prop] });
        continue;
      }
      if (!isEqual(old_meta[prop], new_meta[prop])) {
        operations.push({ op: 'replace', path: `/${prop}`, value: new_meta[prop] });
        continue;
      }
    }
    return operations;
  }

  public save(new_record) {
    const token = document.getElementsByName('authorized_token');
    const headers = new Headers({
      Authorization: 'Bearer ' + token[0]['value'],
      'Content-Type': 'application/json-patch+json',
    });
    const options: RequestOptions = new RequestOptions({ headers: headers });
    const body = this.createPatch(new_record);
    this.http.patch(this.record_url, body, options).subscribe(
      res => {
        this.record = <Record>res.json();
        this.toaster.success('Record saved successfully!');
      },
      err => {
        console.error('Error: ', err);
        this.toaster.error(err, 'Failed to save the record!');
      }
    );
  }

  public fetchData(url: string): Observable<any> {
    this.record_url = url;
    const headers = new Headers({
      Accept: 'application/vnd.ils.refs+json',
    });
    const options: RequestOptions = new RequestOptions({ headers: headers });
    return this.http
      .get(url, options)
      .map((recordRes: any) => recordRes.json())
      .flatMap((record: any) => {
        this.record = record;
        return this.http.get(record.metadata.$schema).map((schemaRes: any) => ({
          record: record,
          schema: schemaRes.json(),
          problemMap: [],
          patches: {},
        }));
      });
  }
}
