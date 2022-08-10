
export class CollegeDto {
    name: string = '';
    description: string = '';
    email: string = '';
    powers: {
        name: string,
        minFreq: number, maxFreq: number,
        minAmt: number, maxAmt: number,
        warn: number, err: number
    }[] = [];
}
