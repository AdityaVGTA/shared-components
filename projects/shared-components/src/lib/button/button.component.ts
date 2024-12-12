import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-button',
  imports: [CommonModule],
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
  @Input() isDisabled = true; // Disabled state
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; // Button type
  @Input() customWidth = ''; // Custom width (e.g., '200px', '50%', etc.)
  @Output() byClick = new EventEmitter<void>(); // Click event emitter

  // Function to combine base classes with variant and size-specific classes
  get buttonClasses(): string {
    const baseClasses = `group flex items-center justify-center rounded-lg web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2`;
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const positionClasses = this.getPositionClasses();
    return `${baseClasses} ${variantClasses} ${sizeClasses} ${positionClasses}`;
  }

  // Variant classes based on the selected variant
  private getVariantClasses(): string {
    const variants: Record<string, string> = {
      primary:
        'bg-secondary text-inverse hover:bg-secondary-hover active:bg-secondary-selected disabled:bg-secondary-disabled disabled:cursor-not-allowed disabled:text-bd-disabled',
      secondary:
        'bg-success text-white hover:bg-success-bg active:bg-success-selected disabled:bg-success-disabled  disabled:text-white  disabled:cursor-not-allowed',
      alternate:
        'bg-error text-white hover:bg-error-bg active:bg-error-selected disabled:bg-error-disabled  disabled:text-white  disabled:cursor-not-allowed',
      'primary-ghost':
        'bg-transparent text-secondary disabled:text-secondary-disabled  disabled:cursor-not-allowed',
      'secondary-ghost':
        'bg-transparent text-success disabled:text-success-disabled  disabled:cursor-not-allowed',
      'alternate-ghost':
        'bg-transparent text-error disabled:text-alternate-disabled  disabled:cursor-not-allowed',
      'primary-outline':
        'border border-secondary text-inverse hover:bg-secondary-hover active:bg-secondary-selected disabled:border-secondary-disabled  disabled:text-bd-disabled  disabled:cursor-not-allowed',
      'secondary-outline':
        'border border-success text-inverse hover:bg-success-bg active:bg-success-selected disabled:border-success-disabled  disabled:text-bd-disabled  disabled:cursor-not-allowed',
      'alternate-outline':
        'border border-error text-inverse hover:bg-error-bg active:bg-error-hover disabled:border-error-disabled  disabled:text-bd-disabled  disabled:cursor-not-allowed',
      'contrast-dark':
        'bg-black text-white border-white disabled:text-bd-disabled  disabled:cursor-not-allowed',
      'contrast-light':
        'bg-neutral-200 text-black border-black disabled:text-neutral-400  disabled:cursor-not-allowed',
      'contrast-outline':
        'bg-transparent text-black disabled:text-neutral-400  disabled:cursor-not-allowed',
      default:
        'bg-secondary text-inverse hover:bg-secondary-hover active:bg-secondary-selected disabled:bg-secondary-disabled disabled:cursor-not-allowed disabled:text-bd-disabled', // default class if no variant is selected
    };
    return variants[this.variant] || variants['default'];
  }

  // Size classes based on the selected size
  private getSizeClasses(): string {
    const sizes: Record<string, string> = {
      sm: 'h-[3.2rem] min-w-[3.2rem] px-[1rem] body_sans_s font-semibold', // Width: 7.9rem, Height: 3.2rem
      base: 'h-[4.0rem] min-w-[4.0rem] px-[1rem] body_sans_m font-semibold', // Width: 8.6rem, Height: 4.0rem
      lg: 'h-[4.8rem] min-w-[4.8rem] px-[1.2rem] body_sans_l font-semibold', // Width: 9.3rem, Height: 4.8rem
      icon: 'h-[3.2rem] min-w-[3.2rem] px-[0.8rem]', // Icon size with fixed width and height
    };
    return sizes[this.size] || sizes['base']; // Default to base if the size is not defined
  }

  // Position classes based on the position prop
  getPositionClasses(): string {
    const positions: Record<string, string> = {
      left: 'flex-row', // Image on the left
      right: 'flex-row-reverse', // Image on the right
      up: 'flex-col', // Image above the text
      down: 'flex-col-reverse', // Image below the text
    };
    const positionClass = positions[this.position] || '';
    return positionClass;
  }
  // Handle click event and emit if not disabled
  handleClick() {
    if (!this.isDisabled) {
      this.byClick.emit();
    }
  }
}
