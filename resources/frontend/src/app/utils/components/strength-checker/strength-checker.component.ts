import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'strength-checker',
  templateUrl: './strength-checker.component.html',
  styleUrls: ['./strength-checker.component.css']
})
export class StrengthCheckerComponent implements OnChanges {
  @Input() public passwordToVerify: string;
  @Input() public barLabel: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  
  constructor() { }

  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;

  msg = '';

  currentStrengthLabel:string;
  currentStrengthValue:number;
  currentStrengthColor:string = '#DDD';

  isValidPassword:boolean;

  checkList:any = {
    lower:false,
    upper:false,
    number:false,
    symbol:false,
    optimLength: false,
  };

  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen','green'];

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToVerify.currentValue;
    this.setBarColors(5, '#DDD');
    this.currentStrengthColor = '#DDD';
    this.checkList = {
      lower:false,
      upper:false,
      number:false,
      symbol:false,
      optimLength: false,
    };

    if (password) {
      const c = this.getColor(this.checkStrength(password));
      this.currentStrengthColor = c.col;
      this.setBarColors(c.idx, c.col);

      //const pwdStrength = this.checkStrength(password);
      //(pwdStrength >= 40)? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);
      this.passwordStrength.emit(this.isValidPassword);

      switch (c.idx) {
        case 1:
          this.msg = 'Muy Debil';
          this.currentStrengthValue = 1;
          break;
        case 2:
          this.msg = 'Debil';
          this.currentStrengthValue = 2;
          break;
        case 3:
          this.msg = 'Mediana';
          this.currentStrengthValue = 3;
          break;
        case 4:
          this.msg = 'Fuerte';
          this.currentStrengthValue = 4;
          break;
        case 5:
          this.msg = 'Muy Fuerte';
          this.currentStrengthValue = 5;
          break;
      }
    } else {
      this.msg = '';
    }
  }

  private checkStrength(p) {
    let force = 0;

    //const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const regex = /[$-\/:-?{-~!"^_#@\\´¿¡`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);
    const optimLength = p.length >= 12;

    this.checkList.lower = lowerLetters;
    this.checkList.upper = upperLetters;
    this.checkList.number = numbers;
    this.checkList.symbol = symbols;
    this.checkList.optimLength = optimLength;
    
    const flags = [lowerLetters, upperLetters, numbers, symbols, optimLength];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    this.isValidPassword = (lowerLetters && upperLetters && numbers && symbols);
    
    force += 2 * p.length + (p.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // short password
    //force = p.length <= 8 ? Math.min(force, 10) : force;

    // poor variety of characters
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    force = passedMatches === 4 ? Math.min(force, 40) : force;
    force = passedMatches === 5 ? Math.min(force, 50) : force;

    return force;
  }

  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else if (s <= 40) {
      idx = 3;
    } else if (s <= 50) {
      idx = 4;
    } else {
      idx = 5;
    }

    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }

}
