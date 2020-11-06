export function pathName(path) {
    const paths = path.split('/');
    let name = '';
    for (let i = 1; i < paths.length; i++) {
        if (paths[i]) {
            name += paths[i][0].toUpperCase() + paths[i].substr(1, paths[i].length - 1);
        }
    }
    return name;
}

export function Tree(id, array, arr = []) {
    return function tree(id, array, arr = []) {
        id = Number(id);
        const ary = [];
        if (id !== 0) {
            arr.push(id);
        }
        for (let i = 0, len = array.length; i < len; i++) {
            if (Number(array[i].parentId) === id) {
                if (Number(array[i].type) === 1) {
                    array[i].isParent = true;
                }
                const parents = [...arr];
                parents.push(array[i].id);
                array[i].parents = parents;
                array[i].name = array[i].menuName;
                array[i].value = array[i].id;
                array[i].label = array[i].menuName;
                ary.push(array[i]);
            }
        }
        if (ary.length > 0) { // 如果有值，采用递归得到他的子元素
            for (let i = 0, len = ary.length; i < len; i++) {
                const children = tree(ary[i].id, array, [...arr]);
                if (children) {
                    ary[i].children = children;
                }
            }
        }
        return ary.length === 0 ? null : ary;
    };

    // return tree(id, array, arr = []);
}

/**
 *** checkParseFloat 验证浮点数
 *** val  数值
 *** integer 整数位数
 *** decimals 几位小点
 *** return true|false
 **/
export function checkParseFloat(val, integer, decimals) {
    integer--;
    const re = new RegExp('^([1-9]\\d{0,' + integer + '}|0)(\\.\\d{1,' + decimals + '})?$');
    return re.test(val);
}

export function percentage(val) {
    return val ? (val * 100).toFixed(2) + '%' : '0.00%';
}

/**
 * 获取今天日期
 **/
export function today_date(sep = '') {
    const now = new Date(); // 当前日期
    const Day = now.getDate(); // 当前日
    let Month = now.getMonth() + 1; // 当前月
    const Year = now.getFullYear(); // 当前年
    if (Month < 10) {
        Month = '0' + Month;
    }
    return Year + sep + Month + sep + Day;
}

export function yesterday_date(sep = '') {
    const now = new Date(); // 当前日期
    now.setTime(now.getTime() - 24 * 60 * 60 * 1000);// 昨天
    const Day = now.getDate(); // 当前日
    let Month = now.getMonth() + 1; // 当前月
    const Year = now.getFullYear(); // 当前年
    if (Month < 10) {
        Month = '0' + Month;
    }
    return Year + sep + Month + sep + Day;
}

export function other_day(day = 1, sep = '') {
    const now = new Date(); // 当前日期
    now.setTime(now.getTime() - day * 24 * 60 * 60 * 1000);// 昨天
    const Day = now.getDate(); // 当前日
    let Month = now.getMonth() + 1; // 当前月
    const Year = now.getFullYear(); // 当前年
    if (Month < 10) {
        Month = '0' + Month;
    }
    return Year + sep + Month + sep + Day;
}

export function month_day(month = 1, sep = '-') {
    const now = new Date();
    now.setMonth(now.getMonth() - month);
    const Day = now.getDate(); // 当前日
    let Month = now.getMonth() + 1; // 当前月
    const Year = now.getFullYear(); // 当前年
    if (Month < 10) {
        Month = '0' + Month;
    }
    return Year + sep + Month + sep + Day;
}

export function Trim(s) {
    if (s === null) {
        return '';
    }
    const str = s.replace(/(^\s*)|(\s*$)/g, '');
    return str;
}

export function ArrToString(arr) {
    if (!Array.isArray(arr) && arr.length === 0) {
        return '';
    }
    const str = arr.join();
    return str;
}

export function stringToArray(str, separate) {
    if (!str) {
        return [];
    }
    const arr = str.split(separate);
    return arr;
}

export function copyDeep(templateData) {
    // templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
    return JSON.parse(JSON.stringify(templateData));
}

export function getRequestQuery(urlStr) {
    let url = '';
    if (typeof urlStr === 'undefined') {
        url = decodeURI(location.search); // 获取url中"?"符后的字符串
    } else {
        url = '?' + urlStr.split('?')[1];
    }
    const theRequest = {};
    if (url.indexOf('?') !== -1) {
        const str = url.substr(1);
        const strS = str.split('&');
        for (let i = 0; i < strS.length; i++) {
            theRequest[strS[i].split('=')[0]] = decodeURI(strS[i].split('=')[1]);
        }
    }
    return theRequest;
}

// 加密和解密方法
export function encrypt(str, passKey, type) {
    if (type === 'encryption') {
        str = window.btoa(str); // Base64加密
        let prand = '';
        for (let i = 0; i < passKey.length; i++) {
            prand += passKey.charCodeAt(i).toString();
        }
        const sPos = Math.floor(prand.length / 5);
        const mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        const incr = Math.ceil(passKey.length / 2);
        const modu = Math.pow(2, 31) - 1;
        if (mult < 2) {
            alert('Please choose a more complex or longer password.');
            return null;
        }
        let salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while (prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        let encChr = '';
        let encStr = '';
        for (let i = 0; i < str.length; i++) {
            encChr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
            if (encChr < 16) {
                encStr += '0' + encChr.toString(16);
            } else {
                encStr += encChr.toString(16);
            }
            prand = (mult * prand + incr) % modu;
        }
        salt = salt.toString(16);
        while (salt.length < 8) salt = '0' + salt;
        encStr += salt;
        return encStr;
    }
    if (type === 'decryption') {
        let prand = '';
        for (let i = 0; i < passKey.length; i++) {
            prand += passKey.charCodeAt(i).toString();
        }
        const sPos = Math.floor(prand.length / 5);
        const mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        const incr = Math.round(passKey.length / 2);
        const modu = Math.pow(2, 31) - 1;
        const salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while (prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        let encChr = '';
        let encStr = '';
        for (let i = 0; i < str.length; i += 2) {
            encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
            encStr += String.fromCharCode(encChr);
            prand = (mult * prand + incr) % modu;
        }
        // return encStr;
        return window.atob(encStr);
    }
}
