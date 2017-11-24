/**
 * 日期操作工具
 * by 璩
 */
import formatDate from './formatDate'

export default {
    getDate () {
        return new Date();
    },
    /**********
     * 将字符串转成日期
     * @param date
     */
    parse (date) {
        if(date instanceof Date) return date;
        return new Date(that.format(date).replace(/\-/g, "/"));
    },
    /******************
     * 将日期转成字符串
     * @param date
     * @param format
     * @returns {*}
     */
    format (date, format) {
        return formatDate(date, format);
    },
    /******************
     * 返回时间戳
     * @type {that.now}
     */
    now (date) {
        if(!date) return this.getDate().getTime();
        return this.parse(date).getTime();
    },
    /**************
     *返回当月天数
     * @param year
     * @param month
     * @returns {number}
     */
    getMonthDay (year, month) {
        if(year instanceof Date){
            month = year.getMonth();
            year = year.getFullYear();
        }
        const months = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (((0 === (year % 4)) && ((0 !== (year % 100)) || (0 === (year % 400)))) && month === 1){
            return 29;
        } else {
            return months[month];
        }
    },
    /********************
     * 返回一个日期向前或向后多少天的新日期
     * @param date
     * @param value
     */
    getOffsetDate (date, value) {
        let time = value * 24 * 3600 * 1000;
        let newTime = this.now(date) + time;
        return this.parse(newTime);
    },
    /*******
     * 返回当前日期的第一天
     * @param date
     */
    getCurDateFirst (date) {
        date = that.parse(date);
        let day = date.getDate();
        return that.getOffsetDate(date, -day + 1);
    },
    /**********
     * 返回当前日期的上一月的第一天
     * @param date
     */
    getPrevDateFirst (date) {
        let prevDate = this.getPrevDateLast(date);
        let day = this.getMonthDay(prevDate);
        return this.getOffsetDate(prevDate, -day + 1);
    },
    /**********
     * 返回当前日期的上一月的最后一天
     * @param date
     */
    getPrevDateLast (date) {
        date = this.parse(date);
        let day = date.getDate();
        return this.getOffsetDate(date, -day);
    },
    /**********
     * 返回当前日期的下一月的第一天
     * @param date
     */
    getNextDateFirst (date) {
        date = this.parse(date);
        let day = this.getMonthDay(date) - date.getDate();
        return this.getOffsetDate(date, day + 1);
    },
    /**********
     * 返回当前日期的下一月的最后一天
     * @param date
     */
    getNextDateLast (date) {
        let nextDate = this.getNextDateFirst(date);
        let day = this.getMonthDay(nextDate);
        return this.getOffsetDate(nextDate, day - 1);
    },
    /*****************
     * 比较两个日期相差多少天
     * @param date1
     * @param date2
     * @returns {number}
     */
    getCompareDateDay (date1, date2) {
        var time1 =this.now(date1);
        var time2 = this.now(date2);
        return (time2 - time1) / (1000 * 3600 * 24);
    },
    /****************
     * 比较两个时间相差多少天
     * @param time1
     * @param time2
     * @returns {number}
     */
    getCompareTimeDay (time1, time2) {
        let date = this.format(this.getDate(), "yyyy-MM-dd");
        return this.getCompareDateDay(date + " " + time1, date + " " + time2);
    },
    /***********
     * 返回一个日期向前或向后多少天的新日期字符串
     * @param date
     * @param value
     * @param format
     * @returns {*}
     */
    getOffsetDateStr (date, value, format) {
        return this.format(this.getOffsetDate(date, value), format || "yyyy-MM-dd");
    }
};