/**
 * 替换指定字段位置为 星号*****
 * @param {string, location, length}
 * string:  被替换的字符串
 * location:包括从前面、中间、后面替换 front、middle、back
 * length:  被替换的长度
 * 1234567890
 */
function replaceBankCardToStar(string, location, length) {
    if (string.length > length) {
        if (location == 'front') {
            var startStr = string.substring(0, length);
            var middleStr = string.substring(length);
            for (let i = 0; i < middleStr.length; i++) {
                middleStr.replace(middleStr[i], '*');
            }
            var finalStr = '' + startStr + middleStr + ''
            return finalStr;
        } else if (location == 'middle') {
            var startStr = string.substring(0, length);
            var middleStr = string.substring(length, string.length - length);
            var lastStr = string.substring(string.length - length, string.length);
            for (let i = 0; i < middleStr.length; i++) {
                middleStr.replace(middleStr[i], '*');
            }
            var finalStr = '' + startStr + middleStr + lastStr + ''
            return finalStr;
        } else {
            var startStr = string.substring(string.length - length, string.length);
            var middleStr = string.substring(0, string.length - length);
            for (let i = 0; i < middleStr.length; i++) {
                middleStr.replace(middleStr[i], '*');
            }
            var finalStr = '' + middleStr + startStr + ''
            return finalStr;
        }
    }
}

/**
 *手机号处理 替换成星号
 * @param {string}
 * 15093250467
 */
function formatPhone(phone) {
    if (phone && phone.length > 0){
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }else{
        return '未知';
    }
}

/**
 *银行卡号处理 替换成星号
 * @param {string}
 * 6217002480000988523
 * 
 */
function formatBankCard(card) {
    if (card && card.length > 0){
        if (card.length == 16) {
            return card.replace(/(\d{4})\d{8}(\d{4})/, "$1********$2");        
        }else{
            return card.replace(/(\d{4})\d{11}(\d{4})/, "$1***********$2");                
        }
    }else{
        return '未知';
    }
 
}

/**
 *姓名处理 替换成星号
 * @param {string}
 * name
 * 
 */
function formatName(name) {
    if (name && name.length > 0) {
        return name.replace(/.(?=.)/g, '*');        
    }else{
        return '未知';
    }
}

/*
**
* 导出action方法
*/
export default {
    replaceBankCardToStar,
    formatPhone,
    formatBankCard,
    formatName
}