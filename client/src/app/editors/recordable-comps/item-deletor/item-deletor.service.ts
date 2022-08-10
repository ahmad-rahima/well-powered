import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class ItemDeletorService {
  updates = new Subject<null>();

}
