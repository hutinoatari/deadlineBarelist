const numberTo2Digits = (n: number): string => (n + "").padStart(2, "0");

const dayString = ["日", "月", "火", "水", "木", "金", "土"];

const dateToYYYYMMDDdHHMM = (date: Date): string => {
    const y = date.getFullYear();
    const mo = date.getMonth() + 1;
    const d = date.getDate();
    const day = date.getDay();
    const h = date.getHours();
    const mi = date.getMinutes();
    const YYYYMMDDdHHMM = `${y}/${numberTo2Digits(mo)}/${numberTo2Digits(d)}(${
        dayString[day]
    }) ${numberTo2Digits(h)}:${numberTo2Digits(mi)}`;
    return YYYYMMDDdHHMM;
};

export { numberTo2Digits, dayString, dateToYYYYMMDDdHHMM };
