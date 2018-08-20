import { BREAKPOINT, BreakPoint, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { InjectionToken } from '@angular/core';

/**
 * Aligns the angular/flex-layout breakpoints with Bootstrap breakpoints.
 * @param bp
 */
export function customizeFlexBreakPoints(bp: BreakPoint) {
  switch (bp.alias) {
    case 'xs': bp.mediaQuery = 'screen and (max-width: 575px)'; break;
    case 'sm': bp.mediaQuery = 'screen and (min-width: 576px) and (max-width: 767px)'; break;
    case 'md': bp.mediaQuery = 'screen and (min-width: 768px) and (max-width: 991px)'; break;
    case 'lg': bp.mediaQuery = 'screen and (min-width: 992px) and (max-width: 1199px)'; break;
    case 'xl': bp.mediaQuery = 'screen and (min-width: 1200px)'; break; // and (max-width: 5000px)
    case 'lt-sm': bp.mediaQuery = 'screen and (max-width: 575px)'; break;
    case 'lt-md': bp.mediaQuery = 'screen and (max-width: 767px)'; break;
    case 'lt-lg': bp.mediaQuery = 'screen and (max-width: 991px)'; break;
    case 'lt-xl': bp.mediaQuery = 'screen and (max-width: 1199px)'; break;
    case 'gt-xs': bp.mediaQuery = 'screen and (min-width: 576px)'; break;
    case 'gt-sm': bp.mediaQuery = 'screen and (min-width: 768px)'; break;
    case 'gt-md': bp.mediaQuery = 'screen and (min-width: 992px)'; break;
    case 'gt-lg': bp.mediaQuery = 'screen and (min-width: 1200px)'; break;
  }
  return bp;
}

export function getBreakPoints() {
  return DEFAULT_BREAKPOINTS.map(customizeFlexBreakPoints);
}

export const CustomBreakPointsProvider = {
  provide: BREAKPOINT as InjectionToken<BreakPoint | BreakPoint[]>,
  useFactory: getBreakPoints,
  multi: true
};
