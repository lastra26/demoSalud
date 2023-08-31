import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'alert-panel',
  templateUrl: './alert-panel.component.html',
  styleUrls: ['./alert-panel.component.css']
})
export class AlertPanelComponent implements OnInit {

  constructor() { }

  alertData: any;
  count: number;
  countDown: Subscription;
  timeToClose: any;
  panelVisible:boolean;

  ngOnInit(): void {
  }

  public closePanel(){
    this.alertData = null;
    if(this.panelVisible){
      if(this.countDown && !this.countDown.closed){
        this.countDown.unsubscribe(); 
        clearTimeout(this.timeToClose);
        this.count = 0;
      }
      this.panelVisible = false;
    }
  }

  public showSuccess(message:string, seconds?:number) {
    this.showPanel('success', message, seconds);
  }

  public showError(message:string, seconds?:number){
    this.showPanel('error', message, seconds);
  }

  public showWarning(message:string, seconds?:number){
    this.showPanel('warning', message, seconds);
  }

  public showInfo(message:string, seconds?:number){
    this.showPanel('info', message, seconds);
  }

  private showPanel(type, message, seconds?:number){
    if(this.countDown && !this.countDown.closed){
      this.countDown.unsubscribe(); 
      clearTimeout(this.timeToClose);
    }
    
    let icon:string;
    switch (type) {
      case 'success':
        icon = 'check_circle';
        break;
      case 'error':
        icon = 'error';
        break;
      case 'warning':
        icon = 'warning';
        break;
      default:
        icon = 'info';
        break;
    }

    this.alertData = {type: type, icon: icon, message: message};
    this.panelVisible = true;
    
    if(seconds){
      let total = seconds * 1000;
      let tick = Math.floor(total / 100); //30;

      this.count = 0;
      this.countDown = timer(0,tick).subscribe(()=>{
        if(this.count == 150){
          this.count = 0;
          console.log('still here... ',this.countDown);
          if(!this.countDown.closed){
            this.countDown.unsubscribe();
          }
        }
        this.count++;
      });

      this.timeToClose = setTimeout (() => { 
        this.closePanel(); 
      }, total+500);
    }
  }
}