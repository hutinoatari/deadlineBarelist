const rand = (n: number): number => Math.floor(Math.random() * n);

const chooseOne = <T>(a: T[]): T => a[rand(a.length)];

const generateRandomString = (): string => {
    const charList =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
            ""
        );
    const randomString = [...Array(32)].map(() => chooseOne(charList)).join("");
    return randomString;
};

export { rand, chooseOne, generateRandomString };
