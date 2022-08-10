import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appNavRecordsAd]'
})
export class NavRecordsAdDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
