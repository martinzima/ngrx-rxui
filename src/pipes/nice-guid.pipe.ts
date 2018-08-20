import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'niceGuid'
})
export class NiceGuidPipe implements PipeTransform {
  static doTransform(value: any) {
    if (value == null) {
      return '';
  }
  
  let asString = value.toString();
  if (asString.startsWith('{') && asString.endsWith('}')) {
      return asString.substr(1, asString.length - 2);
  }

  return asString;
  }

  transform(value: any, format: string = ''): string {
    return NiceGuidPipe.doTransform(value);
  }
}