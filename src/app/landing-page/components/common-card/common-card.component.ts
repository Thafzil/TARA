import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-card',
  templateUrl: './common-card.component.html',
  styleUrls: ['./common-card.component.scss']
})
export class CommonCardComponent implements OnInit {

  @Input() title='';
  @Input() sub='';
  @Input() description='';
  @Input() className=''
  @Input() routeLink=''
  constructor() { }

  ngOnInit(): void {
  }

}
