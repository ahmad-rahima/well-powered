import { Component, OnInit } from '@angular/core';
import { ItemSubmitterService } from './item-submitter.service';

@Component({
  selector: 'app-item-submitter',
  templateUrl: './item-submitter.component.html',
  styleUrls: ['./item-submitter.component.scss']
})
export class ItemSubmitterComponent {
  constructor(public service: ItemSubmitterService) { }

  onSubmit() {
    this.service.updates.next(null);
  }

}
