import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() data!: {
    header: string;
    placeholder_text: string;
    selectedValue?: string | string[],
    options: string[];
  };
  @Input() type: 'selectbox' | 'multiSelectbox' = 'selectbox';
  @Output() valueSelected = new EventEmitter<string>();
  @Output() multiValueSelected = new EventEmitter<string[]>();

  testData: any;
  selectedReason!: string;
  selectedMultiReason: string[] = [];
  dropDown = false;

  upArrowImg = './assets/icons/up.svg';
  downArrowImg = './assets/icons/down.svg';

  ngOnInit() {
    this.testData = this.data;
    this.selectedReason = this.testData.placeholder_text;
    this.patchValue()
  }

  patchValue() {
    if (this.testData.selectedValue) {
      if (this.type == 'selectbox' && typeof this.testData.selectedValue == 'string') {
        const valuePresent = this.testData.options.includes(this.testData.selectedValue);
        if (valuePresent) {
          this.selectedReason = this.testData.selectedValue;
          this.valueSelected.emit(this.selectedReason);
        }
      } else {
        if (this.testData.selectedValue.length > 0) {
          for (let value of this.testData.selectedValue) {
            this.selectedMultiReason.push(value);
          }
        }
        this.multiValueSelected.emit(this.selectedMultiReason)
      }
    }
  }

  openDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropDown = !this.dropDown;
  }

  selectReason(reason: string) {
    this.selectedReason = reason;
    this.valueSelected.emit(reason);
  }

  selectMultiReason(reason: string) {
    const present = this.selectedMultiReason.includes(reason);
    if (present) {
      this.selectedMultiReason = this.selectedMultiReason.filter(item => item !== reason);
    } else {
      this.selectedMultiReason.push(reason);
    }
    this.multiValueSelected.emit(this.selectedMultiReason);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement; 
    if (!target.closest('.form-control')) {
      this.dropDown = false;
    }
  }

}
