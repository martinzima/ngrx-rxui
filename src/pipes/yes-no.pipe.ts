import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'yesNo'
})
export class YesNoPipe implements PipeTransform {
    transform(value: any, format: string = ''): string {
        if (value === null) {
            return '';
        }
        
        return value ? 'Yes' : 'No';
    }
}
