export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomMultipleOfTen() {
    return Math.floor(Math.random() * 10) * 10 + 10;
}