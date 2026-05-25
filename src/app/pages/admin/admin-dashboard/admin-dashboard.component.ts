import { Component, OnInit } from '@angular/core';
import { MetricStatus } from '../../../shared/dashboard-metric-card/dashboard-metric-card.component';

export interface DashboardMetric {
  icon: string;
  title: string;
  value: string;
  footerIcon: string;
  footerText: string;
  status: MetricStatus;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  metrics: DashboardMetric[] = [
    {
      icon: 'currency_rupee',
      title: 'Revenue today',
      value: '₹48,200',
      footerIcon: 'trending_up',
      footerText: '+12% vs yesterday',
      status: 'success'
    },
    {
      icon: 'shopping_cart',
      title: 'Total orders',
      value: '134',
      footerIcon: 'trending_up',
      footerText: '8 new today',
      status: 'success'
    },
    {
      icon: 'groups',
      title: 'Customers',
      value: '2,841',
      footerIcon: 'trending_up',
      footerText: '+19 this week',
      status: 'success'
    },
    {
      icon: 'inventory_2',
      title: 'Low stock alerts',
      value: '4',
      footerIcon: 'warning',
      footerText: 'Action needed',
      status: 'warning'
    }
  ];

  ngOnInit(): void {}
}
