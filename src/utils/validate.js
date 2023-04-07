/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor', 'public', 'private', 'guest']
  return true
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export function getSortFunc(order_prop, mode, sortk, desc) {
  // mode = 1 數字 = 2 字串
  if (mode === 1) {
    var sortfunc = function(a, b) {
      return a[sortk] - b[sortk]
    }

    if (desc === 1) {
      sortfunc = function(a, b) {
        return b[sortk] - a[sortk]
      }
    }
    return sortfunc
  } else {
    var sortfunc1 = function(a, b) {
      var nameA = a[sortk].toUpperCase()
      var nameB = b[sortk].toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }

      return 0
    }

    if (desc === 1) {
      sortfunc1 = function(b, a) {
        var nameA = a[sortk].toUpperCase()
        var nameB = b[sortk].toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        return 0
      }
    }

    return sortfunc1
  }
}

export function sortNum(a, b) {
  // 排序方法
  return a.SortID - b.SortID
}

export function sortStr(b, a) {
  // 排序方法
  var nameA = formatDate(a.UpdateTime)
  var nameB = formatDate(b.UpdateTime)
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  return 0
}

export function TryParseDouble(v) {
  var vv = parseFloat(v)
  if (!isNaN(vv)) return vv
  return v
}

export function isNullOrEmpty(str) {
  if (isString(str)) {
    return str === ''
  }
  return true
}

// Date Process
export function clearTime(datetime) {
  var dateTime = new Date(datetime)
  var year = dateTime.getFullYear()
  var month = dateTime.getMonth()
  var date = dateTime.getDate()
  return new Date(year, month, date, 0, 0, 0)
}

export function addDate(datetime, addCount) {
  var dateTime = new Date(datetime)
  var year = dateTime.getFullYear()
  var month = dateTime.getMonth()
  var date = dateTime.getDate()
  var hour = dateTime.getHours()
  var minute = dateTime.getMinutes()
  var second = dateTime.getSeconds()
  return new Date(year, month, date + addCount, hour, minute, second)
}

export function addMinutes(datetime, addCount) {
  var dateTime = new Date(datetime)
  var year = dateTime.getFullYear()
  var month = dateTime.getMonth()
  var date = dateTime.getDate()
  var hour = dateTime.getHours()
  var minute = dateTime.getMinutes()
  var second = dateTime.getSeconds()
  return new Date(year, month, date, hour, minute + addCount, second)
}

export function formatDate(datetime, format) {
  var dateTime = new Date(datetime)
  if (isNullOrEmpty(format)) {
    format = 'yyyy-MM-dd HH:mm:ss'
  }
  var year = dateTime.getFullYear()
  var month =
    dateTime.getMonth() + 1 < 10
      ? '0' + (dateTime.getMonth() + 1)
      : dateTime.getMonth() + 1
  var date =
    dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
  var hour =
    dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()
  var minute =
    dateTime.getMinutes() < 10
      ? '0' + dateTime.getMinutes()
      : dateTime.getMinutes()
  var second =
    dateTime.getSeconds() < 10
      ? '0' + dateTime.getSeconds()
      : dateTime.getSeconds()

  var millisecond = dateTime.getMilliseconds()

  format = format.replace('yyyy', year)
  format = format.replace('MM', month)
  format = format.replace('dd', date)

  if (format.indexOf('HH' > -1)) {
    format = format.replace('HH', hour)
  }
  if (format.indexOf('hh' > -1)) {
    format = format.replace('hh', hour)
  }

  format = format.replace('mm', minute)
  format = format.replace('ss', second)

  if (format.indexOf('fff' > -1)) {
    format = format.replace('fff', millisecond)
  }
  if (format.indexOf('ooo' > -1)) {
    format = format.replace('ooo', millisecond)
  }

  return format
}

// 日期轉組合成between兩個日期
export function changeBetweenDate(start, end) {
  const startTime = start.substring(0, 11) + '00:00:00'
  const endTime = end.substring(0, 11) + '23:59:59'
  return startTime + '|' + endTime
}

export class Queue {
  constructor() {
    var items = []
    this.enqueue = function(ele) {
      items.push(ele)
      if (items.length > 1000) {
        items.shift()
      }
    } // 入隊
    this.dequeue = function() {
      return items.shift()
    } // 出隊
    this.front = function() {
      return items[0]
    } // 檢視隊頭元素
    this.isEmpty = function() {
      return items.length === 0
    } // 判斷佇列是否為空
    this.size = function() {
      return items.length
    } // 佇列大小
    this.clear = function() {
      items = []
    } // 清空佇列
    this.print = function() {
      console.log(items.toString())
    } // 列印佇列
  }
}
