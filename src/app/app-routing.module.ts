import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',redirectTo:'apps',pathMatch:'full'},
  { path: 'apps', loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'crypto', loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule) },
  { path: 'calci', loadChildren: () => import('./calculator/calculator.module').then(m => m.CalculatorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
