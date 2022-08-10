import { Injectable } from '@angular/core';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';


@Injectable()
export class AsideOptionsService {
    selectedSubject = new Subject<string>();
    selectedId: string = '';
    options$!: Observable<any>;

    take(options$: Observable<any>) {
      this.options$ = options$;
    }

    select(selected: string) {
        this.selectedId = selected;
        this.selectedSubject.next(selected);
    }

    observer(): Observable<string> {
        return this.selectedSubject
            .asObservable()
            .pipe();
    }
}
