import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: true,
})
export class ButtonComponent {
  @Input() buttonText = ''; // Button label text
  @Input() imgIcon = ''; // Icon URL or icon name (string)
  @Input() variant = 'default'; // Variant ('primary', 'secondary', etc.)
  @Input() size = 'base'; // Size ('sm', 'base', 'lg', 'icon')
  @Input() position = ''; // Position ('left', 'right', 'up', 'down')
  @Input() isDisabled = false; // Disabled state
  @Output() onClick = new EventEmitter<void>(); // Click event emitter

  // Function to combine base classes with variant and size-specific classes
  get buttonClasses(): string {
    const baseClasses = `group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2`;
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const positionClasses = this.getPositionClasses();
    return `${baseClasses} ${variantClasses} ${sizeClasses} ${positionClasses}`;
  }

  // Variant classes based on the selected variant
  private getVariantClasses(): string {
    const variants: Record<string, string> = {
      primary: 'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-selected',
      secondary: 'bg-success text-white hover:bg-success-hover active:bg-success-selected',
      alternate: 'bg-error text-white hover:bg-error-hover active:bg-error-selected',
      'primary-ghost' : 'bg-transparent text-primary',
      'secondary-ghost': 'bg-transparent text-success',
      'alternate-ghost': 'bg-transparent text-error',
      'primary-outline': 'border border-secondary text-secondary hover:bg-secondary-hover active:bg-secondary-selected',
      'secondary-outline': 'border border-success text-success hover:bg-success-hover active:bg-success-selected',
      'alternate-outline': 'border border-error text-error hover:bg-error-hover active:bg-error-hover',
      default: 'bg-green web:hover:opacity-90 active:opacity-90', // default class if no variant is selected
    };
    return variants[this.variant] || variants['default'];
  }

  // Size classes based on the selected size
  private getSizeClasses(): string {
    const sizes: Record<string, string> = {
      sm: 'h-[3.2rem] min-w-[3.2rem] w-[7.9rem] px-[1rem]', // Width: 7.9rem, Height: 3.2rem
      base: 'h-[4.0rem] min-w-[4.0rem] w-[8.6rem] px-[1rem]', // Width: 8.6rem, Height: 4.0rem
      lg: 'h-[4.8rem] min-w-[4.8rem] w-[9.3rem] px-[1.2rem]', // Width: 9.3rem, Height: 4.8rem
      icon: 'h-[3.2rem] min-w-[3.2rem] w-[3.2rem] px-[0.8rem]', // Icon size with fixed width and height
    };
    return sizes[this.size] || sizes['base']; // Default to base if the size is not defined
  }

  // Position classes based on the position prop
  private getPositionClasses(): string {
    const positions: Record<string, string> = {
      left: 'order-first', // Text first, image second (image on the left)
      right: 'order-last', // Text first, image second (image on the right)
      up: 'flex-col-reverse', // Text first, image second (image above)
      down: 'flex-col', // Text first, image second (image below)
    };
    return positions[this.position] || ''; // Default: no position if not set
  }

  // Handle click event and emit if not disabled
  handleClick() {
    if (!this.isDisabled) {
      this.onClick.emit();
    }
  }
}
