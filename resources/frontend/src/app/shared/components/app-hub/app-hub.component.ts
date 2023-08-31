import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '../../../apps-list/apps';

@Component({
  selector: 'app-hub',
  templateUrl: './app-hub.component.html',
  styleUrls: ['./app-hub.component.css']
})
export class AppHubComponent implements OnInit {
  @Input() appsList: App[];

  apps: App[];

  constructor(private router:Router) { }

  ngOnInit() {
    this.getApps();
  }

  getApps():void{
    this.apps = this.appsList;
  }

  goTo(url:string){
    let route = '/' + url;
    this.router.navigate([route]);
  }
}