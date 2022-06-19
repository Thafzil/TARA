import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor() { }
  cryptoDes="Cryptocurrencies is an application where user can see all the trending crypto currencies in the order of their trend. In this appplication user can select three currencies as favourite. It also has a feature to sort the currenciesbased on name, ranka nd their details. It has a ticker which shows the trending currencies details for every 5 seconds."
  ngOnInit(): void {
  }

}
