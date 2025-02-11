import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit{
  @Input() inputType: 'default' | 'password' | 'number' | 'phone-number' = 'default';
  @Input() helperText = '';
  @Input() isDisabled = false;
  @Input() submitted = false;
  @Input() isValid = false;
  @Input() buttonText = '';
  @Input() formControl?: any; // Optional formControl input
  @Input() validationMessage = '';
  @Input() getErrorMessage = '';
  @Input() inputIcon: string[] = [];
  @Output() helperButtonAction = new EventEmitter<Event>();
  @Output() secondaryButtonAction = new EventEmitter<Event>();
  icons: string[] = [];
  @Input() inputValue = '';
  getInputTypeValue = '';
  isPasswordVisible = false;  // New flag to track visibility

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
 
  ngOnInit() {
    this.getInputTypeValue = this.getInputType(this.inputType);
    this.initializeIcons();
  }
 
  // Write the value to the input field (for ngModel or FormControl)
  writeValue(value: any): void {
    if (value !== undefined) {
      this.inputValue = value;
    }
  }
 
  // Register a function to handle value changes
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
 
  // Register a function to handle when the input is touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
 
  // Set disabled state
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
 
  // Get input type based on inputType prop
  private getInputType(inputAsPerType: string): string {
    switch (inputAsPerType) {
      case 'password':
        return 'password';
      case 'number':
        return 'number';
      case 'phone-number':
        return 'tel';
      default:
        return 'text';
    }
  }
 
  // Method to handle input change
  onInputChange(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value;
    if (this.formControl) {
      this.formControl.setValue(this.inputValue);
    }
    this.onChange(this.inputValue);  // Notify Angular of the change
  }
 
  // Mark input as touched
  onTouchedHandler(): void {
    this.onTouched();
  }
 
  // Emit helper button click event
  inputActionButton(): void {
    this.helperButtonAction.emit();
  }
 
  // Method for handling the secondary button click event
  secondaryImageFunction(): void {
    if (this.inputType === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.getInputTypeValue = this.isPasswordVisible ? 'text' : 'password';

      // Update the eye icon dynamically
      this.icons = [
        'assets/icons/lock-password.svg',
        this.isPasswordVisible ? 'assets/icons/eye.svg' : 'assets/icons/eye-closed.svg'
      ];
    } else {
      this.secondaryButtonAction.emit();
    }
  }

  formatPhoneNumber(event: Event) {
    if (this.inputType === 'phone-number') {
      let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.slice(0, 5) + ' ' + value.slice(5, 10);
      }
      this.inputValue = value;
      (event.target as HTMLInputElement).value = value;
    }
  }
 
  getPlaceholder() {
    switch (this.inputType) {
      case 'password':
        return '••••••••••••';
      case 'number':
        return 'o o o o o o o o';
      case 'phone-number':
        return 'xxxxx xxxxx';
      default:
        return '';
    }
  }
 
  initializeIcons() {
    switch (this.inputType) {
      case 'default':
        this.icons = this.inputIcon;
        break;
      case 'password':
        this.icons = [
          'assets/icons/lock-password.svg',
          this.isPasswordVisible ? 'assets/icons/eye.svg' : 'assets/icons/eye-closed.svg'
        ];
        break;
      case 'phone-number':
        this.icons = ['assets/icons/phone.svg'];
        break;
    }
  }

 
}
