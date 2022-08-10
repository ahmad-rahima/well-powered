import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, first, of, Subject, Subscription, take, tap } from 'rxjs';
import { AsideOptionsComponent } from '../aside-options/aside-options.component';
import { AsideOptionsService } from '../aside-options/aside-options.service';
import { NavRecordsKeeperService } from '../nav-records/nav-records-keeper.service';
import { ItemDeletorComponent } from './recordable-comps/item-deletor/item-deletor.component';
import { ItemDeletorService } from './recordable-comps/item-deletor/item-deletor.service';
import { ItemSubmitterComponent } from './recordable-comps/item-submitter/item-submitter.component';
import { ItemSubmitterService } from './recordable-comps/item-submitter/item-submitter.service';

@Injectable({
    providedIn: 'root'
})
export class EditorService {
    readonly URL!: string;

    subs: Subscription[] = [];
    selectedId!: string;
    subject = new Subject<any>();
    item = this.subject.asObservable();
    updates$ = new Subject<boolean>();
    messages$ = new Subject<string>();

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        protected http: HttpClient,
        private asideOptionsService: AsideOptionsService,
        private location: Location,
        private navRecordsKeeper: NavRecordsKeeperService,
        private deletor: ItemDeletorService,
        public submitter: ItemSubmitterService
    ) { }

    onInit(id: string) {
        this.navRecordsKeeper.record(ItemDeletorComponent);
        this.navRecordsKeeper.record(ItemSubmitterComponent);
        this.navRecordsKeeper.record(AsideOptionsComponent);

        this.initOptions();
        this.selectedId = id;
        this.observeChanges();
    }


    onDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    get url() { return `${this.URL}/${this.selectedId}`; }

    getItem(id: string) {
        return this.http.get('api/' + this.url)
            .pipe(tap(_ => console.log(`fetched item: ${id}`)));
    }

    updateItem(id: string, item: any) {
        console.log('item is: ', item);
        if (this.selectedId === '') {
            return this.http.post('api/' + this.URL + '/', item, this.httpOptions)
            .pipe(
                tap(_ => console.log('Added new item')),
                catchError((err, res) => {
                    console.error(err);
                    console.log(`operation failed: ${err.msg}`);
                    return of(res);
                }));
        }

        return this.http.put('api/' + this.url, item, this.httpOptions)
            .pipe(
                tap(_ => console.log(`updated item: ${id}`)),
                catchError((err, res) => {
                    console.error(err);
                    console.log(`operation failed: ${err.msg}`);
                    return of(res);
                }));
    }

    observeChanges() {
        const s0 = this.asideOptionsService.observer()
            .subscribe(
                id => {
                    this.selectOption(id);
                });

        const s1 = this.deletor.updates
            .subscribe(_ => {
                this.delete(this.selectedId)
            });

        this.subs.push(s0); this.subs.push(s1)
    }

    selectOption(id: string) {
        this.selectedId = id;
        this.subject.next(this.getItem(id));
        this.location.go(this.url);
    }

    initOptions(): void {
        const options$ = this.http.get('api/' + this.URL);
        this.asideOptionsService.take(options$);
        this.submitter.take(this.updates$);
    }

    delete(id: string) {
        let res = this.http.delete('api/' + this.url)
            .pipe(
                tap(_ => console.log(`deleting item: ${id}`)),
                first(),
                catchError((err, res) => {
                    console.error(err);
                    console.log(`operation failed: ${err.msg}`);
                    return of(res);
                }),
            )
            .subscribe((obj: any) => obj.msg && this.messages$.next(obj.msg));

    }

    submit() {

    }
}
