export function randomHash(len = 10) {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i=0;i<len;i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
    return out;
  }
  