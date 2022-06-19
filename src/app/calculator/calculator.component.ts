import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar) { }
  arr:string[]=['1','2','3','4','5','6','7','8','9','0','+','-','*','/']
  value = '';
  ngOnInit(): void {
  }
  calculate(){
    try {
      this.value=eval(this.value)
    } catch (error:Error|undefined|any) {
      let e:Error=error
      console.log(e.message);
      this._snackBar.open(e.message,'Try Again',{duration:3000});
      this.value=''
    }
    
  }
  addValue(a:string){
    this.value+=a;
  }
}
