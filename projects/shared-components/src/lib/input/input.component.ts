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
  inputValue = '';
  getInputTypeValue = '';
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
      // Toggle password visibility
      this.getInputTypeValue =
        this.getInputTypeValue === 'password' ? 'text' : 'password';
    } else {
      // Emit event to parent when not a password input
      this.secondaryButtonAction.emit(); // Emit event to the parent that the button is clicked
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
        return 'Placeholder text';
    }
  }
 
  initializeIcons() {
    switch (this.inputType) {
      case 'default':
        // this.icons.push('assets/icons/Profile-circle.png', 'assets/icons/microphone.png');
        this.icons=this.inputIcon
        break;
      case 'password':
        this.icons.push('assets/icons/lock-password.png', 'assets/icons/eye.png');
        // this.icons=this.inputIcon
        break;
      case 'phone-number':
        this.icons.push('assets/icons/phone.png');
        break;
    }
  }
 
}
