import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() onCloseSidenav = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {}

  close(){
    this.onCloseSidenav.emit()
  }
}
