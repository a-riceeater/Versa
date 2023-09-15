const monthLong = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 

const dayShort = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const dayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class Timestamp {
    text = ""

    constructor(type) {
        const date = new Date();
        switch (type) {
            case "long":
                this.text = `${dayLong[date.getDay()]} ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2, 4)}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
                break
            case "short":
                this.text = `${dayShort[date.getDay()]}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
                break
            case "date-short":
                this.text = `${monthShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
                break
            case "date-long":
                this.text = `${monthLong[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
                break
            default:
                throw "Invalid Timestmap type; long, short, date-short & date-long only supported"
        }
    }
}
