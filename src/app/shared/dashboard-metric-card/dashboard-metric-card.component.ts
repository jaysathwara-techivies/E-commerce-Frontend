import { Component, Input } from '@angular/core';

export type MetricStatus = 'success' | 'warning' | 'neutral';

@Component({
  selector: 'app-dashboard-metric-card',
  templateUrl: './dashboard-metric-card.component.html',
  styleUrls: ['./dashboard-metric-card.component.scss']
})
export class DashboardMetricCardComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() value = '';
  @Input() footerIcon = '';
  @Input() footerText = '';
  @Input() status: MetricStatus = 'neutral';
}
