import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { SharedComponentsService } from '../shared-components.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent implements OnInit, OnDestroy {
  private dropdownSubscription!: Subscription;

  @Input() data!: {
    header?: string;
    placeholder_text?: string;
    selectedValue?: string | string[];
    options: string[];
  };
  @Input() type: 'selectbox' | 'multiSelectbox' = 'selectbox';
  @Output() valueSelected = new EventEmitter<string>();
  @Output() multiValueSelected = new EventEmitter<string[]>();
  @Input() id!: string; // Add an ID for each dropdown

  testData: any;
  selectedReason!: string;
  selectedMultiReason: string[] = [];
  dropDown = false;

  upArrowImg = './assets/icons/up.svg';
  downArrowImg = './assets/icons/down.svg';

  constructor(private dropdownService: SharedComponentsService) {}

  ngOnInit() {
    this.testData = this.data;
    this.selectedReason = this.testData.placeholder_text;
    this.patchValue();

    this.dropdownSubscription = this.dropdownService.activeDropdownId$.subscribe((activeId) => {
      if (activeId !== this.id) {
        this.dropDown = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.testData = this.data;
  }

  patchValue() {
    if (this.testData.selectedValue) {
      if (this.type === 'selectbox' && typeof this.testData.selectedValue === 'string') {
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
        this.multiValueSelected.emit(this.selectedMultiReason);
      }
    }
  }

  openDropdown(event: MouseEvent) {
    event.stopPropagation();

    if (this.dropdownService.isDropdownActive(this.id)) {
      this.dropdownService.setActiveDropdown(null);
      this.dropDown = false;
    } else {
      this.dropdownService.setActiveDropdown(this.id);
      this.dropDown = true;
    }
  }

  selectReason(reason: string) {
    this.selectedReason = reason;
    this.valueSelected.emit(reason);    
    if (this.type === 'selectbox') {
      this.dropDown = false
      this.dropdownService.isDropdownActive(this.id)
    }
  }

  selectMultiReason(reason: string) {
    const present = this.selectedMultiReason.includes(reason);
    if (present) {
      this.selectedMultiReason = this.selectedMultiReason.filter((item) => item !== reason);
    } else {
      this.selectedMultiReason.push(reason);
    }
    this.multiValueSelected.emit(this.selectedMultiReason);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.form-control') && this.dropDown) {
      this.closeDropdownManually();
    }
  }

  private closeDropdownManually() {
    this.dropdownService.setActiveDropdown(null);
    this.dropDown = false;
  }

  handleKeyPress(event:KeyboardEvent){
    if(this.dropDown){
      console.log(event.key);
    }
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
}
