const length = 24;
let result = '';

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

for (let i = 0; i < length + 1; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

console.log(result);