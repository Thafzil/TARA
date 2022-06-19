import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CurrencyService } from './currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('750ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('750ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CurrencyComponent implements OnInit, OnDestroy {
  coins: any[] = [];
  marketList: any[] = [];
  marketListFav: any[] = [];
  columnsToDisplay: any[] = ['rank', 'name', 'price', 'marketCap'];
  favoriteArr: any[] = [];
  favoriteArrId: any[] = [];
  fiatsArr: any[] = [];
  plotTickr: any[] = [];
  tickrArr: any[] = [];
  panelOpenState=true
  fiatSubscription!: Subscription;
  coinsSubscription!: Subscription;
  tickrSbscription!: Subscription;
  marketSubscription!: Subscription;
  favSubscription!: Subscription;
  rankAsc = false;
  nameAsc = false;
  priceAsc = false;
  isFirst = true;
  getScreenWidth: any;
  marketAsc = false;
  changeAsc = false;
  showValues: any[] = [];
  breakpoint: any;
  page = {
    p1: 0,
    p2: 0,
    p3: 0,
  };
  showArr: any[] = ['rank'];
  expandedElement: any;
  dataSource: any;
  language: any = 'INR';
  tickrSymbol: any = 'BTC';
  fetchStatus: string = 'fetching';
  favFetchStatus: string = 'fetching';
  mainStatus: string = 'fetching';
  isScreenLtMedium: boolean = false;
  constructor(private cryptoSrv: CurrencyService) {}
  ngOnInit() {
    this.breakpoint = window.innerWidth <= 400 ? 1 : 6;
    this.onWindowResize();
    this.getCoinsList('INR');
    this.getFiats();
    setInterval(() => {
      this.isFirst = !this.isFirst;
    }, 4500);
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth <= 850) {
      this.isScreenLtMedium = true;
    } else {
      this.isScreenLtMedium = false;
    }
    this.breakpoint = this.isScreenLtMedium ? 1 : 6;
  }
  getFiats() {
    this.fiatSubscription = this.cryptoSrv.getFiats().subscribe((res: any) => {
      this.fiatsArr = res;
    });
  }
  getCoinsList(fiatCode?: any) {
    this.mainStatus = 'fetching';
    this.favoriteArr = [];
    this.coinsSubscription = this.cryptoSrv
      .getCoinsList(fiatCode)
      .subscribe((res: any) => {
        this.coins = res.coins;
        this.tickrArr = this.coins.slice(0, 3);
        this.getTickrValues();
        if (this.favoriteArrId.length > 0) {
          this.favoriteArr = [];
          const temp = this.coins.filter(
            (coin: any) => this.favoriteArrId.indexOf(coin.id) !== -1
          );
          this.favoriteArr = temp;
        }

        this.mainStatus = 'done';
      });
  }
  getTickrValues() {
    this.showValues = [];
    this.tickrArr.forEach((tkr: any) => {
      this.tickrSbscription = this.cryptoSrv
        .getMarkets(tkr.id)
        .subscribe((res: any) => {
          this.showValues.push(res.splice(0, 10));
          this.plotTickr = this.showValues[0];
        });
    });
  }
  getMarkets(coinId: any) {
    this.fetchStatus = 'fetching';
    this.marketSubscription = this.cryptoSrv
      .getMarkets(coinId)
      .subscribe((res: any) => {
        this.marketList = res;
        this.fetchStatus = 'done';
      });
  }

  getMarketsFav(coinId: any) {
    this.favFetchStatus = 'fetching';
    this.favSubscription = this.cryptoSrv
      .getMarkets(coinId)
      .subscribe((res: any) => {
        this.marketListFav = res;
        this.favFetchStatus = 'done';
      });
  }
  addToFav(coin: any) {
    this.favoriteArr = this.favoriteArr.filter((cn: any) => cn.id !== coin.id);
    this.favoriteArrId = this.favoriteArrId.filter((cn: any) => cn !== coin.id);
    this.favoriteArr.push(coin);
    this.favoriteArrId.push(coin.id);
    var element = document.getElementById('favId');
    setTimeout(() => {
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    });
  }
  removeFromFav(coin: any) {
    this.favoriteArr = this.favoriteArr.filter((cn: any) => cn.id !== coin.id);
    this.favoriteArrId = this.favoriteArrId.filter((cn: any) => cn !== coin.id);
  }
  setFiat(fiatCode: any) {
    this.fiatsArr.forEach((fiat: any) => {
      if (fiat.name === fiatCode) {
        this.language = fiat.name;
      }
    });
    this.nameAsc = false;
    this.rankAsc = false;
    this.priceAsc = false;
    this.marketAsc = false;
    this.changeAsc = false;
    this.showArr = [];
    this.showArr.push('rank');
    this.getCoinsList(fiatCode);
    this.tickrSymbol = 'BTC';
  }
  setTickr(ind: any) {
    this.plotTickr = this.showValues[ind];
    this.tickrSymbol = this.tickrArr[ind].symbol;
  }
  sortBy(sortType: any) {
    this.showArr = [];
    this.showArr.push(sortType);
    switch (sortType) {
      case 'rank':
        this.sortLogic(sortType, this.rankAsc);
        this.rankAsc = !this.rankAsc;
        this.nameAsc = false;
        this.priceAsc = false;
        this.marketAsc = false;
        this.changeAsc = false;
        break;
      case 'symbol':
        this.sortLogic(sortType, this.nameAsc);
        this.nameAsc = !this.nameAsc;
        this.rankAsc = false;
        this.priceAsc = false;
        this.marketAsc = false;
        this.changeAsc = false;
        break;
      case 'price':
        this.sortLogic(sortType, this.priceAsc);
        this.priceAsc = !this.priceAsc;
        this.nameAsc = false;
        this.rankAsc = false;
        this.marketAsc = false;
        this.changeAsc = false;
        break;
      case 'marketCap':
        this.sortLogic(sortType, this.marketAsc);
        this.marketAsc = !this.marketAsc;
        this.nameAsc = false;
        this.priceAsc = false;
        this.rankAsc = false;
        this.changeAsc = false;
        break;
      case 'priceChange1d':
        this.sortLogic(sortType, this.changeAsc);
        this.changeAsc = !this.changeAsc;
        this.nameAsc = false;
        this.priceAsc = false;
        this.marketAsc = false;
        this.rankAsc = false;
        break;

      default:
        break;
    }
  }
  sortLogic(sortType: any, boolVal: any) {
    if (boolVal) {
      this.coins.sort((a: any, b: any) => (a[sortType] > b[sortType] ? 1 : -1));
    } else {
      this.coins.sort((a: any, b: any) => (a[sortType] < b[sortType] ? 1 : -1));
    }
  }

  changePage(event: PageEvent, ind: any) {
    if (ind === 1) {
      this.page.p1 = event.pageIndex * 10;
    } else if (ind === 2) {
      this.page.p2 = event.pageIndex * 10;
    } else if (ind === 3) {
      this.page.p3 = event.pageIndex * 10;
    }
  }

  ngOnDestroy(): void {
    this.fiatSubscription.unsubscribe();
    this.coinsSubscription.unsubscribe();
    this.tickrSbscription.unsubscribe();
    if(this.marketSubscription){
          this.marketSubscription.unsubscribe();
    }
    if(this.favSubscription){
      this.favSubscription.unsubscribe();
    }
  }
}
