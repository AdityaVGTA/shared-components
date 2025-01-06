import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


export interface CheckboxData {
  header?: {
    label: string;
    checked: boolean;
  };
  data: {
    label: string;
    checked: boolean;
    helper?: string;
    type?: string;
    message?: string;
    disabled?: boolean;
  }[];
}
@Component({
  selector: 'lib-check-box',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.css'
})
export class CheckBoxComponent {
  headerCheckClass = '';
  @Input() multiSelect = true;
  @Input() data: CheckboxData = {
    data: [],
  };
  @Input() size = 'medium';
  @Input() orientation:'vertical'|'horizontal' = 'vertical'

  @Output() dataEvent = new EventEmitter<any>();

  infoImgPath = './assets/icons/info.png';
  crossImgPath = './assets/icons/cross.png';
  checkImgPath = './assets/icons/check.png';

  downImgPath = './assets/icons/down.svg';  
  upImgPath = './assets/icons/up.svg';  
  drop = true  

  toggleOptions(){    
    this.drop = !this.drop  
  } 

  sendData() {
    this.dataEvent.emit(this.data);
  }

  ngOnInit() {
    this.changeHeaderSelectionStyle();
  }

  toggleCheckbox(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.data) this.data.data[index].checked = target.checked;
    this.changeHeaderSelectionStyle();
  }

  toggleSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectAll = target.checked;
    if (this.data)
      this.data.data.forEach((checkbox) => {
        if (!checkbox.disabled) {
          checkbox.checked = selectAll;
        }
      });
    this.changeHeaderSelectionStyle();
  }

  changeHeaderSelectionStyle(): void {
    if (this.data) {
      const enabledItems = this.data.data.filter((item) => !item.disabled);
      const selectedCount = enabledItems.filter((item) => item.checked).length;
      const totalEnabledItems = enabledItems.length;

      if (this.data.header) {
        if (selectedCount === 0) {
          this.data.header.checked = false;
          this.headerCheckClass = 'uncheckedClass';
        } else if (selectedCount === totalEnabledItems) {
          this.data.header.checked = true;
          this.headerCheckClass = 'checkedClass';
        } else {
          this.data.header.checked = true;
          this.headerCheckClass = 'minusClass';
        }
      }

      this.sendData();
    } else {
      console.log('Data for the checkbox has not provided.');
    }
  }
}
