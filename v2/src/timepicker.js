/**
 * Time picker functionality
 */
import { dom } from './dom-utils.js';
import { renderTimePicker } from './template.js';

export class TimePicker {
  constructor(picker) {
    this.picker = picker;
  }

  render(side) {
    const html = renderTimePicker(side, this.picker.timePicker24Hour, this.picker.timePickerSeconds);
    const container = this.picker.container.querySelector('.drp-calendar.' + side + ' .calendar-time');
    
    if (container) {
      container.innerHTML = html;
      
      // Set current values
      const date = side === 'left' ? this.picker.startDate : this.picker.endDate;
      
      if (date) {
        let hour = date.hour();
        
        if (!this.picker.timePicker24Hour) {
          const ampm = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12;
          if (hour === 0) hour = 12;
          
          const ampmSelect = container.querySelector('.ampmselect');
          if (ampmSelect) {
            ampmSelect.value = ampm;
          }
        }
        
        const hourSelect = container.querySelector('.hourselect');
        const minuteSelect = container.querySelector('.minuteselect');
        
        if (hourSelect) {
          hourSelect.value = hour;
        }
        
        if (minuteSelect) {
          const minute = Math.round(date.minute() / this.picker.timePickerIncrement) * this.picker.timePickerIncrement;
          minuteSelect.value = minute;
        }
        
        if (this.picker.timePickerSeconds) {
          const secondSelect = container.querySelector('.secondselect');
          if (secondSelect) {
            secondSelect.value = date.second();
          }
        }
      }
    }
  }

  update(side) {
    const container = this.picker.container.querySelector('.drp-calendar.' + side + ' .calendar-time');
    
    if (!container) return;

    let hour = parseInt(container.querySelector('.hourselect')?.value || 0, 10);
    const minute = parseInt(container.querySelector('.minuteselect')?.value || 0, 10);
    const second = this.picker.timePickerSeconds ? 
                   parseInt(container.querySelector('.secondselect')?.value || 0, 10) : 0;

    if (!this.picker.timePicker24Hour) {
      const ampm = container.querySelector('.ampmselect')?.value;
      if (ampm === 'PM' && hour < 12) {
        hour += 12;
      }
      if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }
    }

    const date = side === 'left' ? this.picker.startDate : this.picker.endDate;
    
    if (date) {
      const newDate = date.clone().hour(hour).minute(minute).second(second);
      
      if (side === 'left') {
        this.picker.setStartDate(newDate);
      } else {
        this.picker.setEndDate(newDate);
      }
    }
  }
}
