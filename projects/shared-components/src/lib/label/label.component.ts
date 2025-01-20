import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class LabelComponent {
  @Input() text = '';
  @Input() variant: 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'positive' 
  | 'success-ghost' 
  | 'error-ghost' 
  | 'warning-ghost' 
  | 'positive-ghost' = 'success';
  @Input() size: 'xs' | 's' | 'm' | 'l' = 'm';

  getVariantClasses(): string {
    const sizeClasses = {
      xs: {font:'body_sans_xs', height: '24px'},
      s: {font:'body_sans_s', height: '26px'} ,
      m: {font:'body_sans_m', height: '29px'} ,
      l: {font:'body_sans_l', height: '31px'},
    };

    const variantClasses: Record<string, string> = {
      'success': 'px-5 py-[4px] text-center whitespace-nowrap text-success rounded-[100px] bg-success-bg w-fit',
      'error': 'px-5 py-[4px] text-center whitespace-nowrap text-error rounded-[100px] bg-error-bg w-fit',
      'warning': 'px-5 py-[4px] text-center whitespace-nowrap text-warning rounded-[100px] bg-warning-bg w-fit',
      'positive': 'px-5 py-[4px] text-center whitespace-nowrap text-alternate rounded-[100px] bg-alternate-bg-0 w-fit',
      'success-ghost': 'text-success w-fit    ',
      'error-ghost': 'text-error w-fit    ',
      'warning-ghost': 'text-warning w-fit    ',
      'positive-ghost': 'text-alternate w-fit ', 
    };

    const sizeClass = sizeClasses[this.size] || sizeClasses['m']; 
    const variantClass = variantClasses[this.variant] || variantClasses['success']; 
    return `${variantClass} ${sizeClass.font} ${sizeClass.height}`;
  }
}
