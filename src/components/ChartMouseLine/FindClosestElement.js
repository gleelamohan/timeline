import { bisector } from 'd3-array';

/**
 * Like d3.bisect but chooses the closest element, not always the left or right
 * That is, finds the element in the array closest to the value through the use of accessor
 */

export default function findClosestElement(array, value, accessor) {

    if (!array || !array.length) {
        return null;
    }

    const bisect = bisector(accessor).right;
    const pointIndex = bisect(array, value);
    const left = array[pointIndex - 1],
        right = array[pointIndex];

    let element = null;

    // take the closer element
    if (left && right) {
        element = Math.abs(value - accessor(left)) < Math.abs(value - accessor(right))
            ? left
            : right;
    } else if (left) {
        element = left;
    } else {
        element = right;
    }

    return element;
}

export {
    findClosestElement
};
