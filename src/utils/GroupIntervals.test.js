import date from 'date-and-time';
import groupIntervals from './GroupIntervals';

describe('GroupIntervals', () => {
    test('empty data', () => {
        const data = [];

        const result = groupIntervals(data);

        expect(result).toEqual([]);
    });

    test('null data', () => {
        const data = null;

        const result = groupIntervals(data);

        expect(result).toEqual([]);
    });

    test('undefined data', () => {
        const result = groupIntervals();

        expect(result).toEqual([]);
    });

    test('consecutive tsClose and tsOpen', () => {
        const data = [{
            tsOpen: 1,
            tsClose: 3
        }, {
            tsOpen: 2,
            tsClose: 3
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: 1,
            tsClose: 3,
            items: data
        }]);
    });

    test('colliding tsClose and tsOpen', () => {
        const data = [{
            tsOpen: 1,
            tsClose: 2
        }, {
            tsOpen: 2,
            tsClose: 3
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: 1,
            tsClose: 3,
            items: data
        }]);
    });

    test('second interval inside first', () => {
        const data = [{
            tsOpen: 1,
            tsClose: 4
        }, {
            tsOpen: 2,
            tsClose: 3
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: 1,
            tsClose: 4,
            items: data
        }]);
    });

    test('first interval inside second', () => {
        const data = [{
            tsOpen: 2,
            tsClose: 3
        }, {
            tsOpen: 1,
            tsClose: 10
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: 1,
            tsClose: 10,
            items: data
        }]);
    });

    test('coinciding intervals', () => {
        const data = [{
            tsOpen: 2,
            tsClose: 3
        }, {
            tsOpen: 2,
            tsClose: 3
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: 2,
            tsClose: 3,
            items: data
        }]);
    });

    test('1 overlapping and 1 non-overlapping interval', () => {
        const data = [{
            tsOpen: 3,
            tsClose: 5
        }, {
            tsOpen: 2,
            tsClose: 4
        }, {
            tsOpen: 6,
            tsClose: 7
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: 2,
            tsClose: 5,
            items: [data[0], data[1]]
        }, {
            tsOpen: 6,
            tsClose: 7,
            items: [data[2]]
        }]);
    });

    test('dates 1 overlapping and 1 non-overlapping interval', () => {
        const isUTC = true;
        const yesterday = date.parse('2017-10-30', 'YYYY-MM-DD', isUTC);
        const today = date.addDays(yesterday, 1);
        const tomorrow = date.addDays(today, 1);

        const sevenDays = 7;
        const aWeekLater = date.addDays(today, sevenDays);
        const aYearLater = date.addYears(today, 1);

        const data = [{
            tsOpen: yesterday,
            tsClose: today
        }, {
            tsOpen: today,
            tsClose: tomorrow
        }, {
            tsOpen: aWeekLater,
            tsClose: aYearLater
        }];

        const result = groupIntervals(data);

        expect(result).toEqual([{
            tsOpen: yesterday,
            tsClose: tomorrow,
            items: [data[0], data[1]]
        }, {
            tsOpen: aWeekLater,
            tsClose: aYearLater,
            items: [data[2]]
        }]);
    });
});
