import { Injectable } from '@angular/core';
import { EditorService } from '../editors.service';

@Injectable({
  providedIn: 'root'
})
export class CollegesService extends EditorService {
  override readonly URL = 'colleges';

    getPowers() {
        return this.http.get('api/powers');
    }
}
