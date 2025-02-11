import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-radio-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.css'
})
export class RadioButtonComponent {
  @Input() size: 's' | 'm' | 'l' = 'm'; 
  @Input() name: string = '';
  @Input() radioValues!: {
    radioName: string,
    radioHelpText: string,
    state: boolean,
    disabled: boolean,
  }[];
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';

  @Output() valueSelected = new EventEmitter<any>();

  onValueSelect(value: string) {
    this.valueSelected.emit(value);
  }
  ngOnInit(){
      //console.log(this.state,this.label,this.helpText,this.size);
  }
  getLabelSize() {
      switch (this.size) {  
          case 's':
            return 'body_sans_xs'; 
          case 'm':
            return 'body_sans_s';  
          case 'l':
            return 'body_sans_m';  
          default:
            return 'body_sans_s';
      }
  }
  getHelpSize() {
      switch (this.size) {  
          case 's':
            return 'body_sans_xs'; 
          case 'm':
            return 'body_sans_xs';  
          case 'l':
            return 'body_sans_s';  
          default:
            return 'body_sans_m';
      }
  }
  
  getOrientationClass() {
    return {
      'flex flex-col gap-5': this.orientation === 'vertical',
      'flex flex-row flex-wrap items-start gap-[4rem] max-sm: gap-[2rem]': this.orientation === 'horizontal'
    };
  }

  

  getRadioSize(){
      switch (this.size) {  
          case 's':
            return 'w-[16px] h-[16px]'; 
          case 'm':
            return 'w-[20px] h-[20px]';  
          case 'l':
            return 'w-[24px] h-[24px]';  
          default:
            return 'w-[20px] h-[20px]';
      }
  }
}
