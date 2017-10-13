/**
 * 日历辅助组件
 *
 */
var getType = require("../util/getType");

module.exports = function() {
    var that = {};
    var current = new Date();

    that.setDate = function() {
        if (getType(arguments[0]) == "Date") {
            current = new Date(arguments[0].getFullYear() , arguments[0].getMonth(), arguments[0].getDate());
        } else if (getType(arguments[0]) == "string") {
            current = new Date(arguments[0].replace(/\-/g, "/"));
        } else if (arguments.length == 3) {
            current = new Date(arguments[0] + "/" + arguments[1] + "/" + arguments[2]);
        }
    }

    that.getDate = function() {
        return current;
    }

    that.format = function(formatStr, now) {
        return module.exports.format(formatStr, now || current);
    }

    /**
     * 获取视图数据
     * @param  {number} startDay 可取值1或者0，表示周日还是周一开始一周，默认是0
     * @return {object}          视图数据
     */
    that.getView = function(startDay) {
        startDay = startDay == 1 ? 1 : 0;
        var date = new Date(current.getFullYear(), current.getMonth(), 1);
        var firstDay = date.getDay();
        var startDate = new Date(date.getFullYear(), date.getMonth(), 1 - firstDay + startDay);
        date = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        var lastDay = date.getDay();
        var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - lastDay) + startDay);
        var dateDiff = parseInt((endDate - startDate) / (1000 * 60 * 60 * 24));
        dateDiff < 41 && (endDate.setTime(endDate.getTime() + 7 * 1000 * 60 * 60 * 24));
        date = new Date(startDate);
        var view = [];

        while(date.getTime() <= endDate.getTime()) {
            view.push({
                ins: date,
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                day: date.getDay()
            });

            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        }

        return view;
    }

    return that;
}

module.exports.format = function(formatStr, now) {
    now = now || new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var sec = now.getSeconds();

    var fixNum = function(num) {
        return num < 10 ? "0" + num : num;
    }

    return formatStr.replace(/\%yyyy/g, now.getFullYear())
        .replace(/\%yy/g, now.getFullYear().toString().substr(2))
        .replace(/\%MM/g, fixNum(month))
        .replace(/\%M/g, month)
        .replace(/\%dd/g, fixNum(date))
        .replace(/\%d/g, date)
        .replace(/\%hh/g, fixNum(hours))
        .replace(/\%h/g, hours)
        .replace(/\%mm/g, fixNum(minutes))
        .replace(/\%m/g, minutes)
        .replace(/\%ss/g, fixNum(sec))
        .replace(/\%s/g, sec);
}