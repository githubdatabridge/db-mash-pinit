export function gridCoordinates(fromX, toX, fromY, toY) {

    return {
        [Symbol.iterator]: iterator
    };

    function iterator() {
        let x = fromX;
        let y = fromY;

        return {
            next: next
        };

        function next() {
            if (x > toX) {
                x = fromX;
                y++;
            }
            if (y > toY) {
                return { done: true };
            }
            const result = { x: x, y: y };
            x++;
            return { value: result };
        }
    }
}
