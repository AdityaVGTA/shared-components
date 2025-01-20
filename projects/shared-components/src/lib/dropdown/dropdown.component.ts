import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { SharedComponentsService } from '../shared-components.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent implements OnInit, OnDestroy, OnChanges {
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
  @Input() id!: string;

  testData: any;
  selectedReason!: string;
  selectedMultiReason: string[] = [];
  dropDown = false;
  dropdownPosition: 'top' | 'bottom' = 'bottom';

  upArrowImg = './assets/icons/up.svg';
  downArrowImg = './assets/icons/down.svg';

  constructor(private dropdownService: SharedComponentsService, private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {}

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
    if (changes['data'] && changes['data'].currentValue !== changes['data'].previousValue) {
      this.testData = this.data;
      this.patchValue();
    }
  }

  patchValue() {
    if (this.testData.selectedValue) {
      if (this.type === 'selectbox' && typeof this.testData.selectedValue === 'string') {
        if (this.testData.options.includes(this.testData.selectedValue)) {
          this.selectedReason = this.testData.selectedValue;
          this.valueSelected.emit(this.selectedReason);
        }
      } else if (Array.isArray(this.testData.selectedValue)) {
        this.selectedMultiReason = this.testData.selectedValue.filter((val: string) =>
          this.testData.options.includes(val)
        );
        this.multiValueSelected.emit(this.selectedMultiReason);
      }
    }
  }

  openDropdown(event: MouseEvent) {
    event.stopPropagation();

    if (this.dropDown) {
      return; // Prevent re-opening
    }

    if (this.dropdownService.isDropdownActive(this.id)) {
      this.closeDropdownManually();
    } else {
      this.dropdownService.setActiveDropdown(this.id);
      this.dropDown = true;
      this.adjustDropdownPosition();
    }
  }

  selectReason(reason: string) {
    this.selectedReason = reason;
    this.valueSelected.emit(reason);
    setTimeout(() => {
      this.closeDropdownManually(); // Delayed close
    }, 0);
    }

  selectMultiReason(reason: string) {
    if (this.selectedMultiReason.includes(reason)) {
      this.selectedMultiReason = this.selectedMultiReason.filter((item) => item !== reason);
    } else {
      this.selectedMultiReason.push(reason);
    }
    this.multiValueSelected.emit(this.selectedMultiReason);
  }

  adjustDropdownPosition() {
    if (!this.dropDown) return;

    setTimeout(() => {
      const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-content');
      const selectBox = this.elementRef.nativeElement.querySelector('.dropdown-control');

      if (!dropdown || !selectBox) return;

      const rect = selectBox.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = dropdown.scrollHeight;

      this.dropdownPosition = dropdownHeight > availableSpaceBelow ? 'top' : 'bottom';
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.dropDown) {
      this.closeDropdownManually();
    }
  }

  private closeDropdownManually() {
    this.dropdownService.setActiveDropdown(null);
    this.dropDown = false;
    this.cdRef.markForCheck(); // Mark for update in next cycle

  }

  @HostListener('window:resize')
  @HostListener('document:scroll')
  onResizeOrScroll() {
    this.adjustDropdownPosition();
  }

  handleKeyPress(event: KeyboardEvent) {
    if (this.dropDown && event.key === 'Escape') {
      this.closeDropdownManually();
    }
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
}
