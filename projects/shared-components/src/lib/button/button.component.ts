import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'lib-button',
    templateUrl: './button.component.html',
    styleUrl: './button.component.css',
    standalone: true
})
export class ButtonComponent {
  @Input() buttonText = ''; // Button label
  @Input() imgIcon = ''; // Accept imgIcon input
  @Input() variant = 'default'; // Variant ('default', 'destructive', etc.)
  @Input() size = 'default'; // Size ('default', 'sm', 'lg', 'icon')
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

  private getVariantClasses(): string {
    const variants: Record<string, string> = {
      // loginButton: 'w-[100%] h-20 text-white bg-black rounded-md',
      blackSubmitButton: 'submit-button hover:cursor-pointer',
      blackReviewButton: 'review-button rounded-[15px] pb-1.6',
      whiteButton: 'cancel-button rounded-[15px] pb-1.6',
      default: 'bg-green web:hover:opacity-90 active:opacity-90',
      destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
      outline:
        'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
      secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
      ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
      link: 'web:underline-offset-4 web:hover:underline web:focus:underline',
    };
    return variants[this.variant] || variants['default'];
  }

  private getSizeClasses(): string {
    const sizes: Record<string, string> = {
      default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
      sm: 'h-[40px] rounded-md px-3',
      lg: 'w-full h-16 rounded-2xl px-8 native:h-14',
      icon: 'h-10 w-10',
      lsm: 'w-[100%] h-[40px] rounded-md px-3',
    };
    return sizes[this.size] || sizes['default'];
  }

  // getPositionClasses(): string {
  //   const positions: Record<string, string> = {
  //     left: 'absolute left-0',
  //     right: 'absolute right-0',
  //     up: 'absolute top-0',
  //     down: 'absolute bottom-0',
  //   };
  //   return positions[this.position] || ''; // Default to no position if not set
  // }
  getPositionClasses(): string {
    const positions: Record<string, string> = {
      left: 'order-first', // Text first, image second (image on the left)
      right: 'order-last', // Text first, image second (image on the right)
      up: 'flex-col-reverse', // Text first, image second (image above)
      down: 'flex-col',
    };
    return positions[this.position] || ''; // Default: no position if not set
  }

  ngOnInit(): void {}

  handleClick() {
    if (!this.isDisabled) {
      this.onClick.emit();
    }
  }
}
