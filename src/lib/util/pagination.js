/**
 * 用于前端分页的自动计算组件
 */
var clone = require("../json/clone");
var merge = require("../json/merge");

var func = function(list, size) {
    var that = {};
    var pagination = {};

    pagination["total"] = list.length;
    pagination["size"] = size;
    pagination["count"] = (pagination["total"] % pagination["size"])
        ? Math.floor(pagination["total"] / pagination["size"]) + 1
        : pagination["total"] / pagination["size"];
    pagination["count"] = pagination["count"] == 0 ? 1 : pagination["count"];

    that.getTotal = function() {
        return pagination["total"];
    }

    that.getSize = function() {
        return pagination["size"];
    }

    that.getCount = function() {
        return pagination["count"];
    }

    that.getListByPage = function(page) {
        var currentList = [];
        var startIndex = 0;
        var endIndex = 0;
        var prevIndex = 0;
        var nextIndex = 0;
        page = page < 1 ? 1 : (page > pagination["count"] ? pagination["count"] : page);
        startIndex = (page - 1) * pagination["size"];
        endIndex = startIndex + pagination["size"] - 1;
        endIndex = endIndex > (pagination["total"] - 1) ? pagination["total"] - 1 : endIndex;
        prevIndex = page == 1 ? 1 : page - 1;
        nextIndex = page == pagination["count"] ? page : page + 1;

        for (var i = startIndex; i <= endIndex; i++) {
            currentList.push(clone(list[i]));
        }

        return merge(pagination, {
            "page": page,
            "start": startIndex,
            "end": endIndex,
            "list": currentList,
            "prev": prevIndex,
            "next": nextIndex
        });
    }

    return that;
}

func.computePageNav = function(pageIndex, pageCount, navLen) {
    pageIndex = pageIndex > pageCount ? pageCount : pageIndex;
    pageIndex = pageIndex < 1 ? 1 : pageIndex;
    var startIndex = pageIndex - Math.floor(navLen / 2);
    startIndex = startIndex < 1 ? 1 : startIndex;
    var endIndex = startIndex + navLen - 1;
    endIndex = endIndex > pageCount ? pageCount : endIndex;
    startIndex = endIndex - navLen + 1;
    startIndex = startIndex < 1 ? 1 : startIndex;

    return {
        start: startIndex,
        end: endIndex,
        index: pageIndex
    }
}

module.exports = func;