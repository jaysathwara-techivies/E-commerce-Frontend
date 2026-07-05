import { Component, OnInit } from '@angular/core';
import { MetricStatus } from '../../../shared/dashboard-metric-card/dashboard-metric-card.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
      title: 'Products',
      value: '4',
      footerIcon: 'warning',
      footerText: 'Low Stock',
      status: 'warning'
    }
  ];
  // Add these properties inside your DashboardComponent class

recentOrders: any[] = [];

salesByCategory = [
  { name: 'Men',    percent: 72, label: '₹18k' },
  { name: 'Women',  percent: 58, label: '₹14k' },
  { name: 'Beauty', percent: 40, label: '₹9k'  },
  { name: 'Kids',   percent: 22, label: '₹5k'  },
];

lowStockItems = [
  { name: 'Blue Denim Jacket (M)',  qty: 2 },
  { name: 'Kids Sneakers (sz 5)',   qty: 1 },
  { name: 'Rose Face Serum',        qty: 5 },
  { name: 'White Linen Shirt (L)',  qty: 4 },
];

topProducts = [
  { name: 'Slim Fit Chinos',    category: 'Men',    sold: 214, revenue: 192600 },
  { name: 'Floral Kurti Set',   category: 'Women',  sold: 189, revenue: 132300 },
  { name: 'Vitamin C Serum',    category: 'Beauty', sold: 156, revenue:  93600 },
  { name: 'Kids Denim Jacket',  category: 'Kids',   sold:  98, revenue:  88200 },
];

recentActivity = [
  { type: 'success', icon: 'check_circle', text: 'Order <strong>#1042</strong> marked as delivered',       time: '2 min ago'  },
  { type: 'info',    icon: 'person_add',   text: 'New customer <strong>Sneha Joshi</strong> registered',   time: '14 min ago' },
  { type: 'danger',  icon: 'cancel',       text: 'Order <strong>#1039</strong> cancelled by customer',     time: '38 min ago' },
  { type: 'success', icon: 'add_circle',   text: '<strong>Slim Fit Chinos</strong> added to products',     time: '1 hr ago'   },
  { type: 'info',    icon: 'local_shipping',text: 'Order <strong>#1041</strong> shipped via Delhivery',    time: '2 hr ago'   },
];
  dashboardStats: any;
  constructor(
    private authService: AuthenticationService
  ) {

  }
  ngOnInit(): void {
    this.getDashboardStats()
    this.getRecentOrders()
  }


  getDashboardStats() {
    this.authService.apiCall('get', 'http://localhost:3000/admin/dashboard-stats').subscribe({
      next: (res) => {
        this.dashboardStats = res;
        this.metrics[0].value = this.dashboardStats.totalRevenue
        this.metrics[1].value = this.dashboardStats.totalOrders
        this.metrics[2].value = this.dashboardStats.totalUsers;
        this.metrics[3].value = this.dashboardStats.totalProducts;
        if (!this.dashboardStats?.totalLowStockProduct && this.metrics[3]) {
           this.metrics[3].footerText = ''
           this.metrics[3].footerIcon = ''
        }
      }
    })
  }

  getRecentOrders() {
    this.authService.apiCall('get', 'http://localhost:3000/admin/recent-orders').subscribe({
      next: (res: any) =>{
        this.recentOrders = res
        this.recentOrders.forEach((item: any) => {
          item.category = item.items?.map((item2: any) => item2.category).join(', ');
        });
        console.log(this.recentOrders);
        
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }
}
