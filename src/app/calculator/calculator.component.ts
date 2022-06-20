import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar) { }
  arr1:string[]=['1','2','3','4','5','6','7','8','9','0'];
  arr2=['+','-','*','/','%','(',')','^']
  value = '';
  back='<-'
  allCalculations:string[]=[]
  ngOnInit(): void {
  }
  calculate(){
    try {
      if(this.value){
          this.allCalculations.push(this.value)
          this.value=eval(this.value.replaceAll('^','**'))
          this.value=this.value.toString();
          this.allCalculations.push('='+this.value)
      }

    } catch (error:Error|undefined|any) {
      let e:Error=error
      console.log(e.message);
      this.allCalculations.push(e.message)
      this._snackBar.open(e.message,'Try Again',{duration:3000});
      this.value=''
    }
    
  }
  addValue(a:string){
    this.value+=a;
  }
  deleteVal(){
    this.value=this.value.substring(0,this.value.length-1)
  }

  clearInput(){
    this.value='';
  }
  clearCals(){
    this.allCalculations=[]
  }

}
