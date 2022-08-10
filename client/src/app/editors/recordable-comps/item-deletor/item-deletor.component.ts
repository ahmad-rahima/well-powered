import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ItemDeletorService } from './item-deletor.service';

@Component({
  selector: 'app-item-deletor',
  templateUrl: './item-deletor.component.html',
  styleUrls: ['./item-deletor.component.scss']
})
export class ItemDeletorComponent implements OnInit {
  constructor(private service: ItemDeletorService) { }

  ngOnInit(): void {
  }

  onDelete() {
    this.service.updates.next(null);
  }
}
