import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  amount: number;
  payment: 'Razorpay' | 'COD' | 'UPI';
  status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  category: string;
  txnId: string;
  address: Address;
  courier?: string;
  awb?: string;
}

export interface TimelineStep {
  label: string;
  done: boolean;
  active: boolean;
  time?: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(8px)' }))
      ])
    ])
  ]
})
export class OrdersComponent implements OnInit {

  // ─── State ────────────────────────────────────────────────────
  searchTerm = '';
  filterCategory = '';
  filterPayment = '';
  sortBy = 'newest';
  activeTab = 'all';
  currentPage = 1;
  pageSize = 7;

  selectedOrder: Order | null = null;
  newStatus: string = '';

  statusOptions = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  stats = {
    total: 1284,
    pending: 38,
    shippedToday: 12,
    cancelled: 9
  };

  tabs = [
    { label: 'All', value: 'all', count: 1284 },
    { label: 'Processing', value: 'Processing', count: 24 },
    { label: 'Shipped', value: 'Shipped', count: 14 },
    { label: 'Delivered', value: 'Delivered', count: 1198 },
    { label: 'Cancelled', value: 'Cancelled', count: 48 },
  ];

  // ─── Mock data (replace with API call) ───────────────────────
  allOrders: Order[] = [
    {
      id: '1042', customerName: 'Priya Shah', email: 'priya@email.com', phone: '+91 98765 43210',
      date: '10 May 2026', category: 'Women', payment: 'Razorpay', status: 'Delivered',
      items: [{ name: 'Slim Fit Chinos', qty: 1, price: 1200 }, { name: 'White Sneakers', qty: 1, price: 500 }],
      subtotal: 1700, shipping: 140, amount: 1840,
      txnId: 'pay_Qx7k2mN9',
      courier: 'Delhivery', awb: 'DL849201',
      address: { name: 'Priya Shah', line1: '14, Shyamal Cross Rd', line2: 'Satellite', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' }
    },
    {
      id: '1041', customerName: 'Rahul Mehta', email: 'rahul@email.com', phone: '+91 91234 56789',
      date: '10 May 2026', category: 'Men', payment: 'UPI', status: 'Shipped',
      items: [{ name: 'Denim Jacket (M)', qty: 1, price: 3200 }],
      subtotal: 3200, shipping: 0, amount: 3200,
      txnId: 'upi_Ab3dEf7g',
      courier: 'BlueDart', awb: 'BD920145',
      address: { name: 'Rahul Mehta', line1: '22, Vastrapur Lake Rd', line2: 'Vastrapur', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054' }
    },
    {
      id: '1040', customerName: 'Anjali Kulkarni', email: 'anjali@email.com', phone: '+91 97890 12345',
      date: '9 May 2026', category: 'Beauty', payment: 'COD', status: 'Processing',
      items: [{ name: 'Rose Face Serum', qty: 2, price: 1800 }, { name: 'Vitamin C Cream', qty: 1, price: 1200 }],
      subtotal: 4800, shipping: 0, amount: 5600,
      txnId: 'cod_pending',
      address: { name: 'Anjali Kulkarni', line1: '5, Prahladnagar', line2: 'Corporate Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' }
    },
    {
      id: '1039', customerName: 'Dev Patel', email: 'dev@email.com', phone: '+91 95432 10987',
      date: '9 May 2026', category: 'Kids', payment: 'UPI', status: 'Cancelled',
      items: [{ name: 'Kids Sneakers Sz5', qty: 1, price: 980 }],
      subtotal: 980, shipping: 0, amount: 980,
      txnId: 'upi_Zk9xLm2p',
      address: { name: 'Dev Patel', line1: '8, Bopal Ring Rd', line2: 'Bopal', city: 'Ahmedabad', state: 'Gujarat', pincode: '380058' }
    },
    {
      id: '1038', customerName: 'Meera Rao', email: 'meera@email.com', phone: '+91 98001 22334',
      date: '8 May 2026', category: 'Men', payment: 'Razorpay', status: 'Delivered',
      items: [{ name: 'Linen Shirt (L)', qty: 1, price: 1450 }, { name: 'Chino Pants', qty: 1, price: 1000 }],
      subtotal: 2450, shipping: 0, amount: 2450,
      txnId: 'pay_Mn4pQr6s',
      courier: 'Ekart', awb: 'EK774412',
      address: { name: 'Meera Rao', line1: '19, Navrangpura', line2: 'CG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009' }
    },
    {
      id: '1037', customerName: 'Arjun Singh', email: 'arjun@email.com', phone: '+91 91111 33445',
      date: '8 May 2026', category: 'Men', payment: 'Razorpay', status: 'Shipped',
      items: [{ name: 'Polo T-Shirt', qty: 2, price: 1800 }, { name: 'Track Pants', qty: 2, price: 2400 }],
      subtotal: 4200, shipping: 0, amount: 7120,
      txnId: 'pay_Yt8uVw1x',
      courier: 'Delhivery', awb: 'DL991234',
      address: { name: 'Arjun Singh', line1: '3, Thaltej Cross Rd', line2: 'Thaltej', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054' }
    },
    {
      id: '1036', customerName: 'Sneha Joshi', email: 'sneha@email.com', phone: '+91 97654 32100',
      date: '7 May 2026', category: 'Women', payment: 'COD', status: 'Delivered',
      items: [{ name: 'Floral Kurti Set', qty: 1, price: 650 }],
      subtotal: 650, shipping: 0, amount: 650,
      txnId: 'cod_collected',
      address: { name: 'Sneha Joshi', line1: '11, Maninagar', line2: 'Maninagar East', city: 'Ahmedabad', state: 'Gujarat', pincode: '380008' }
    }
  ];

  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];

  // ─── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    this.applyFilters();
  }

  // ─── Filters & Sorting ────────────────────────────────────────
  setTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allOrders];

    // Tab filter
    if (this.activeTab !== 'all') {
      result = result.filter(o => o.status === this.activeTab);
    }

    // Search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term)
      );
    }

    // Category
    if (this.filterCategory) {
      result = result.filter(o => o.category === this.filterCategory);
    }

    // Payment
    if (this.filterPayment) {
      result = result.filter(o => o.payment === this.filterPayment);
    }

    // Sort
    result.sort((a, b) => {
      if (this.sortBy === 'newest') return parseInt(b.id) - parseInt(a.id);
      if (this.sortBy === 'oldest') return parseInt(a.id) - parseInt(b.id);
      if (this.sortBy === 'asc') return a.amount - b.amount;
      if (this.sortBy === 'desc') return b.amount - a.amount;
      return 0;
    });

    this.filteredOrders = result;
    this.updateTabCounts();
    this.paginate();
  }

  updateTabCounts(): void {
    this.tabs.forEach(tab => {
      if (tab.value === 'all') {
        tab.count = this.allOrders.length;
      } else {
        tab.count = this.allOrders.filter(o => o.status === tab.value).length;
      }
    });
  }

  // ─── Pagination ───────────────────────────────────────────────
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginate();
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // ─── Order Detail ─────────────────────────────────────────────
  selectOrder(order: Order): void {
    this.selectedOrder = order;
    this.newStatus = order.status;
    setTimeout(() => {
      document.querySelector('.detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  closeDetail(): void {
    this.selectedOrder = null;
  }

  updateStatus(): void {
    if (!this.selectedOrder) return;
    const order = this.allOrders.find(o => o.id === this.selectedOrder!.id);
    if (order) {
      order.status = this.newStatus as Order['status'];
      this.selectedOrder = { ...order };
      this.applyFilters();
      // TODO: call your API here → this.orderService.updateStatus(order.id, this.newStatus)
    }
  }

  cancelOrder(order: Order): void {
    if (confirm(`Cancel order #${order.id}? This cannot be undone.`)) {
      order.status = 'Cancelled';
      this.selectedOrder = { ...order };
      this.applyFilters();
      // TODO: call your API here
    }
  }

  printInvoice(): void {
    window.print();
    // TODO: generate a proper PDF invoice
  }

  exportCSV(): void {
    const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Payment', 'Status'];
    const rows = this.filteredOrders.map(o =>
      [o.id, o.customerName, o.date, o.amount, o.payment, o.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── CSS Class Helpers ────────────────────────────────────────
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Delivered': 'pill-green',
      'Shipped':   'pill-amber',
      'Processing':'pill-blue',
      'Packed':    'pill-blue',
      'Cancelled': 'pill-red',
    };
    return map[status] || 'pill-gray';
  }

  getPaymentClass(payment: string): string {
    const map: Record<string, string> = {
      'Razorpay': 'pill-green',
      'UPI':      'pill-blue',
      'COD':      'pill-gray',
    };
    return map[payment] || 'pill-gray';
  }

  // ─── Timeline ─────────────────────────────────────────────────
  getTimeline(status: string): TimelineStep[] {
    const steps = ['Processing', 'Packed', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status);

    if (status === 'Cancelled') {
      return [
        { label: 'Placed', done: true, active: false, time: 'Order placed' },
        { label: 'Cancelled', done: false, active: true, time: 'Order cancelled' }
      ];
    }

    return steps.map((step, i) => ({
      label: step,
      done: i < currentIndex,
      active: i === currentIndex,
      time: i <= currentIndex ? this.getMockTime(i) : undefined
    }));
  }

  private getMockTime(index: number): string {
    const times = ['9:14 am', '9:20 am', '11:00 am', '4:15 pm'];
    return times[index] || '';
  }
}