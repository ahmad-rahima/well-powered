import { Injectable } from '@angular/core';
import { EditorService } from '../editors.service';

@Injectable({
  providedIn: 'root'
})
export class PowersService extends EditorService {
  override readonly URL = 'powers';
}
