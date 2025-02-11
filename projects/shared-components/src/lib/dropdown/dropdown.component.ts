import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { SharedComponentsService } from '../shared-components.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})


export class DropdownComponent implements OnInit, OnDestroy, OnChanges {
  private dropdownSubscription!: Subscription;
  @Input() disabled: boolean = false; // Default is enabled
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
  activeTooltip: HTMLElement | null = null; 
  upArrowImg = './assets/icons/up.svg';
  downArrowImg = './assets/icons/down.svg';

  constructor(private dropdownService: SharedComponentsService, private elementRef: ElementRef, private cdRef: ChangeDetectorRef, private renderer: Renderer2) {
  }

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
  
  showTooltip(): string | undefined {
    if (!this.selectedReason || this.selectedReason === this.testData.placeholder_text) {
      return undefined;  // Ensures Angular fully removes the attribute
    }
    return this.selectedReason;
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
    if (this.disabled) {
      event.stopPropagation(); // Prevents dropdown from opening
      return;
    }

    event.stopPropagation();

    if (this.dropDown) {
      this.closeDropdownManually(); // Close when clicking again
      return;
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
    if (!this.disabled) {
      this.selectedReason = reason;
      this.valueSelected.emit(reason);
      setTimeout(() => {
        this.closeDropdownManually(); // Delayed close
      }, 0);
    }
    }

  selectMultiReason(reason: string) {
    if (!this.disabled) {

    if (this.selectedMultiReason.includes(reason)) {
      this.selectedMultiReason = this.selectedMultiReason.filter((item) => item !== reason);
    } else {
      this.selectedMultiReason.push(reason);
    }
    this.multiValueSelected.emit(this.selectedMultiReason);
  }
  }
  adjustDropdownPosition() {
    if (!this.dropDown) return;
  
    setTimeout(() => {
      const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-content');
      const selectBox = this.elementRef.nativeElement.querySelector('.dropdown-control .dropdown');
  
      if (!dropdown || !selectBox) return;
  
      // Get the bounding rect of the select box (trigger element)
      const triggerRect = selectBox.getBoundingClientRect();
      const dropdownHeight = dropdown.scrollHeight; // Height of the dropdown content
      const viewportHeight = window.innerHeight; // Viewport height
  
      // Function to find the closest scrollable parent container
      const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
        let parent = element.parentElement;
        while (parent) {
          const style = getComputedStyle(parent);
          if (style.overflow === 'auto' || style.overflow === 'scroll') {
            return parent;
          }
          parent = parent.parentElement;
        }
        return null; // No scrollable parent found
      };
  
      const scrollableParent = findScrollableParent(selectBox); // Find nearest scrollable parent
  
      // Calculate available space below and above the select box
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
  
      // Define a small buffer space for dropdown (e.g., 10px)
      const buffer = 10;
  
      // If there’s a scrollable parent, we need to check its bounds
      if (scrollableParent) {
        const scrollableParentRect = scrollableParent.getBoundingClientRect();
        const spaceInParentBelow = scrollableParentRect.bottom - triggerRect.bottom; // Space below dropdown inside parent container
        const spaceInParentAbove = triggerRect.top - scrollableParentRect.top; // Space above dropdown inside parent container
  
        // Check if there's enough space below within the scrollable parent
        if (spaceInParentBelow >= dropdownHeight + buffer) {
          // Enough space below within the scrollable parent, open dropdown below
          dropdown.style.top = `${triggerRect.bottom + buffer}px`;
          dropdown.style.bottom = 'unset'; // No bottom positioning
        } else if (spaceInParentAbove >= dropdownHeight + buffer) {
          // Not enough space below, but space above within the scrollable parent, open dropdown above
          dropdown.style.top = 'unset'; // Remove top positioning
          dropdown.style.bottom = `${scrollableParentRect.bottom - triggerRect.top + buffer}px`; // Open above within the parent container
        } else {
          // Not enough space in either direction, try opening below as fallback
          dropdown.style.top = `${triggerRect.bottom + buffer}px`;
          dropdown.style.bottom = 'unset';
        }
      } else {
        // If there’s no scrollable parent, fallback to viewport handling
        if (spaceBelow >= dropdownHeight + buffer) {
          // Enough space below, position dropdown below
          dropdown.style.top = `${triggerRect.bottom + buffer}px`;
          dropdown.style.bottom = 'unset'; // Ensure no bottom positioning
        } else if (spaceAbove >= dropdownHeight + buffer) {
          // Not enough space below, position dropdown above
          dropdown.style.top = 'unset'; // Remove top positioning
          dropdown.style.bottom = `${viewportHeight - triggerRect.top + buffer}px`;
        } else {
          // Default to opening below if no space found
          dropdown.style.top = `${triggerRect.bottom + buffer}px`;
          dropdown.style.bottom = 'unset';
        }
      }
  
      // Ensure dropdown matches the width of the select box
      dropdown.style.position = 'absolute';
      dropdown.style.width = `${triggerRect.width}px`; // Match the width of the select box
  
      // Ensure dropdown is visible
      dropdown.style.display = 'block';
      dropdown.style.visibility = 'visible';
      dropdown.style.opacity = '1';
  
      // Optional: Adjust the z-index to ensure dropdown is on top
      dropdown.style.zIndex = '9999';
  
      this.cdRef.detectChanges(); // Trigger change detection to update view
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
