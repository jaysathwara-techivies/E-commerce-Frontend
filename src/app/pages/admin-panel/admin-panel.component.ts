import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  selectedTab: string = 'pending'; // Default tab

  constructor() { }

  ngOnInit(): void {
  }

  openTab(tabName: string): void {
    this.selectedTab = tabName;
  }
}
