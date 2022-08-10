
type range = [number, number];

/* getNumber(s, e) -- get a random number in range [s,e] */
export function getNumber([start, end]: range) {
    let len = end - start;

    return Math.random() * len + start;
}


/* getNumbers -- get array full of random numbers
 * len: count of returned random numbers
 * firstPoint: a range that the first point must fall into
 * nextPoint: a range that will get added to its previous to generate
 *  the next random number
 */
export async function getNumbers(len, firstPoint: range, nextPoint: range): Promise<number[]> {
    let n = new Array(len);
    n[0] = getNumber(firstPoint);

    const [startNP, endNP] = nextPoint;
    for (let i = 1; i < len; ++i) {
        const prv = n[i-1];
        n[i] = Math.abs(getNumber([prv + startNP, prv + endNP]));
    }

    return n;
}
