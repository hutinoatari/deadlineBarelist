const afterDate = (date, n) => {
    const oldDate = date.getDate();
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate()+n);
    return newDate;
}
const dateToYYYYMMDD = (date) =>{
    const y = date.getFullYear();
    const m = date.getMonth()+1;
    const d = date.getDate();
    const YYYYMMDD = `${y}/${(""+m).padStart(2,"0")}/${(""+d).padStart(2,"0")}`;
    return YYYYMMDD;
}
const dateToYYYYMMDDHHMM = (date) => {
    const y = date.getFullYear();
    const mo = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const yyyymmddhhmm = `${y}/${mo}/${d} ${h}:${(""+mi).padStart(2,"0")}`;
    return yyyymmddhhmm;
}
const dayString = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];