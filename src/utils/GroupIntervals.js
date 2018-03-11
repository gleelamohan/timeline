// Interval coalesce algorithm

//  Examples:
//    Interval 1 => [1, 3]
//    Interval 2 => [2, 3]
//        Reults => [1, 3]

//    Interval 1 => [1, 3]
//    Interval 2 => [5, 6]
//        Reults => [[1, 3], [5, 6]]

export default function groupIntervals(items) {
    if (!items || items.length === 0) {
        return [];
    }

    const stack = [];
    items.sort((a, b) => a.tsOpen - b.tsOpen);

    items.forEach((item) => {
        const topItem = stack.pop();

        if (topItem) {
            if (item.tsOpen <= topItem.tsClose) {
                stack.push({
                    tsOpen: topItem.tsOpen < item.tsOpen
                        ? topItem.tsOpen
                        : item.tsOpen,
                    tsClose: topItem.tsClose > item.tsClose
                        ? topItem.tsClose
                        : item.tsClose,
                    items: [...topItem.items, item]
                });
            } else {
                stack.push(topItem);
                stack.push({
                    tsOpen: item.tsOpen,
                    tsClose: item.tsClose,
                    items: [item]
                });
            }
        } else {
            stack.push({
                tsOpen: item.tsOpen,
                tsClose: item.tsClose,
                items: [item]
            });
        }

    });

    return stack;
}
