import {
    Component,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
} from '@angular/core';

import { select } from 'd3-selection';
import { timeFormat, TimeLocaleObject } from 'd3-time-format';

@Component({
  selector: 'idlmProgressBar',
  template: `
    <div class='progress'>
        <div class='progress__bar' [style.width]="progressPercentage + '%'"></div>
    </div>
  `,
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
    @Input() progressPercentage: number;
}
