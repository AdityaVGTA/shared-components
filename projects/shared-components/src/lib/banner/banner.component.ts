import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'lib-banner',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  @Input() bigTextMessage = '';
  @Input() smallTextMessage = '';
  @Input() message = '';
  @Input() buttonText = '';
  @Input() variant = '';
  @Input() size = '';
  @Input() imgIcon = '';
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  reviewLabel = 'Review';

  get buttonClasses(): string {
    const baseClasses = `group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2`;
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    return `${baseClasses} ${variantClasses} ${sizeClasses}`;
  }

  private getVariantClasses(): string {
    const variants: Record<string, string> = {
      Primary:
        'bg-amberwood text-gray-700 tc-dark font-thin flex justify-between items-center p-4 border rounded-[1rem] shadow-md',
      Secondary: 'submit-button',
      Alternate:
        'bg-light text-gray-700 tc-dark font-thin flex justify-between items-center p-4 border rounded-[1rem] shadow-md',
      Success:
        'bg-green text-gray-700 tc-dark font-thin flex justify-between items-center p-4 border rounded-[1rem] shadow-md',
      Destructive:
        'bg-red text-gray-700 tc-dark font-thin flex justify-between items-center p-4 border rounded-[1rem] shadow-md',
      bigText: 'text-gray-700 tc-dark font-thin',
      smallText: 'text-gray-400 tc-dark font-thin',
    };
    return variants[this.variant] || variants['default'];
  }

  private getSizeClasses(): string {
    const sizes: Record<string, string> = {
      default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
      sm: 'h-[40px] rounded-md px-3',
      lg: 'h-11 rounded-md px-8 native:h-14',
      icon: 'h-10 w-10',
    };
    return sizes[this.size] || sizes['default'];
  }

  get bigText(): string {
    // Apply 'textClass' specifically to the span element
    return 'text-gray-700 tc-dark font-thin';
  }
  get Primary(): string {
    // Apply 'textClass' specifically to the span element
    return 'bg-amberwood flex justify-between items-center p-4 border rounded-[1rem] shadow-md';
  }
  bannerClick() {
    console.log('banner Click');
    this.onClick.emit();
  }
}

