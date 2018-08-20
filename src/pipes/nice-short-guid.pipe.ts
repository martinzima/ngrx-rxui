import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'niceShortGuid'
})
export class NiceShortGuidPipe implements PipeTransform {
    transform(value: any, format: string = ''): string {
        if (value == null) {
            return '';
        }
        
        let asString = value.toString();
        if (asString.startsWith('{') && asString.endsWith('}')) {
            asString = asString.substr(1, asString.length - 2);
        }

        let parts = asString.split('-');
        return parts[0];
    }
}