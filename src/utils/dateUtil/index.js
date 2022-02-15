import moment from 'moment';

class DateUtil {
    constructor() {
        this.format = '';
        this.formatWithTime = '';
        this.formatWithSlash = '';
        this.formatInNumber = '';
    }
    setFormat(format) {
        this.format = format;
    }
    setFormatWithTime(format) {
        this.formatWithTime = format;
    }
    setFormatWithSlash(format) {
        this.formatWithSlash = format;
    }
    setFormatInNumbersOnly(format) {
        this.formatInNumber = format;
    }
    formatDate(date) {
        return moment(date).format(this.format);
    }
    formatDateWithTime(date) {
        return moment(date).format(this.formatWithTime);
    }
    formatDateWithSlash(date) {
        return moment(date).format(this.formatWithSlash);
    }
    formatInNumbersOnly(date) {
        return moment(date).format(this.formatInNumber);
    }
}

export default new DateUtil();

