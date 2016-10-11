import { extent } from 'd3-array';

// more flexible extent
export function _extent(vals:any[]):[any, any]{
    return extent(vals);
}
