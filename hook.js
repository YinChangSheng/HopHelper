    
    
function slice(a) {
    return Array.prototype.slice.call(arguments)
}

function isXX(val, xxx) {
return Object.prototype.toString.call(val) === '[object '+ xxx +']'
}

function isNull(val) {
return isXX(val, 'Null')
}

function isObject(val) {
return isXX(val, 'Object')
}

function isArray(val) {
return isXX(val, 'Array')
}

function isUndefined(val) {
return isXX(val, 'Undefined')
}

function isString(val) {
return isXX(val, 'String')
}

function isEmptyString(val) {
return isString(val) && val.length === 0
}

function isEmpty(val) {
return isUndefined(val) || isNull(val) || isEmptyString(val)
}

function isNotEmpty(val) {
return !isEmpty(val)
}

function isPrimitive(test) {
return (test !== Object(test));
}

function initFormEl(selector, ns) {
    var cacheKey = 'hop.' + selector
    if (isNotEmpty(ns)) {
        cacheKey += ns;
    }
    var hopEnv = localStorage.getItem(cacheKey)
    if ( isNotEmpty(hopEnv) ) {
        $(selector).val(hopEnv)
    }
    $(selector).on('change', function (e) {
        if (isEmpty(e.target.value)) {
            localStorage.removeItem(cacheKey)
        } else {
            localStorage.setItem(cacheKey, e.target.value)
        }
    })
}

function createRequestObject2(){
    var temp = $("#mockParam").val();
    if(temp == ''){
        showMessage('生成失败，JSON不能为空',2);
        return;
    }
    var tempJSON;
    try {
        tempJSON=Hjson.rt.parse(temp);
    } catch(e) {
        console.log('error：'+temp+'!!!'+e);
        showMessage('生成失败，请检查输入的值是否合法',2);
        return;
    }
    $("#pramsBox").html("");
    var changeJson = changeJsonToClassMeta2(tempJSON);
    reBackHtml(changeJson, 0, 'pramsBox');
}

function trimLineComment(comments) {
    if (isArray(comments) && comments.length == 0) {
        return ""
    }
    for (var i in comments) {
        var comment = comments[i]
        if ( isString(comment) ) {
            var name = $.trim(comment.replace(/\/\//, ''))
            if ( !isEmpty(name) && !isEmptyString(name) ) {
                return name
            }
        }
    }
    return ""
}

function changeJsonToClassMeta2(jsonObj) {
    if ( isUndefined(jsonObj) ) {
        alert('JSON对象不能为空！');
    }
    var arr = new Array();
    var desc = ''
    //遍历第一层数据
    for (var topKey in jsonObj) {
        console.log("+"+topKey)
        //如果对象类型为object类型且数组长度大于0，递归继续解析
        // if (jsonObj[topKey] != null && jsonObj[topKey].length > 0 && typeof(jsonObj[topKey]) == "object") {
        if ( isArray(jsonObj[topKey]) && jsonObj[topKey].length > 0 ) {
            if ( isPrimitive(jsonObj[topKey][0]) ) {
                desc = trimLineComment(jsonObj['__COMMENTS__']['c'][topKey])
                var info = { "classMeta":{"className":"java.util.List"}, "mockValue": jsonObj[topKey], "fieldName": topKey, desc: desc };
                arr.push(info);
            } else {
                var arr3 = changeJsonToClassMeta2(jsonObj[topKey]);
                //var info = { "classMeta":{"className":"java.util.List", "fieldMetaList": arr3},"fieldName":topKey};
                desc = trimLineComment(jsonObj['__COMMENTS__']['c'][topKey])
                var info = { "classMeta":{"className":"java.util.List", "fieldMetaList": arr3},"fieldName":topKey, desc: desc };
                arr.push(info);
            }
        } else {
            //如果对象类型为object类型，依次循环取出所有元素
            if (isObject(jsonObj[topKey])) {
                var arr1 = new Array();
                for (var childKey in jsonObj[topKey]) {
                    //如果对象类型为object类型，递归继续解析
                    if (typeof(jsonObj[topKey][childKey]) == "object") {
                        var arr2;
                        var info;
                        if(jsonObj[topKey][childKey].length > 0){
                            arr2 = changeJsonToClassMeta2(jsonObj[topKey][childKey].pop());
                            desc = trimLineComment(jsonObj[topKey]['__COMMENTS__']['c'][childKey])
                            info = { "classMeta":{"className":"java.lang.List", "fieldMetaList": arr2},"fieldName":childKey, desc: desc};
                        } else {
                            arr2 = changeJsonToClassMeta2(jsonObj[topKey][childKey]);
                            desc = trimLineComment(jsonObj[topKey]['__COMMENTS__']['c'][childKey])
                            info = { "classMeta":{"className":"java.lang.Object", "fieldMetaList": arr2},"fieldName":childKey, desc: desc};
                        }
                        arr1.push(info);
                    } else {
                        //如果对象类型为object类型，直接取元素名称和值
                        desc = trimLineComment(jsonObj[topKey]['__COMMENTS__']['c'][childKey])
                        var info = { "classMeta":{"className":getDataType(jsonObj[topKey][childKey])}, "fieldName": childKey, "mockValue": jsonObj[topKey][childKey], desc: desc };
                        arr1.push(info)
                    }
                }
                desc = trimLineComment(jsonObj['__COMMENTS__']['c'][topKey])
                var info = { "classMeta":{"className":"java.lang.Object","fieldMetaList": arr1},"fieldName":topKey, desc: desc};
                arr.push(info);
            } else {
                if ( isObject(jsonObj) ) {
                    //如果对象类型为object类型，直接取元素名称和值
                    desc = trimLineComment(jsonObj['__COMMENTS__']['c'][topKey])
                }
                var info = { "classMeta":{"className":getDataType(jsonObj[topKey])}, "fieldName": topKey, "mockValue": jsonObj[topKey], desc: desc};
                arr.push(info);
            }
        }
    }
    return arr;
}

$(function () {
    setTimeout(function () {
        if (location.pathname === '/list.do') {
            initFormEl('#env')
            initFormEl('#app')
            initFormEl('#module')
            initFormEl('#apiName')
            initFormEl('#apiVersion')
            $('#query').trigger('click')
        }
        if (location.pathname === '/test.do') {
            var nsKey = location.search
            initFormEl('#userName')
            initFormEl('#appv')
            initFormEl('#deviceId')
            initFormEl('#model')
            initFormEl('#os')
            initFormEl('#password')
            initFormEl('#osv')
            initFormEl('#data', nsKey)
            initFormEl('#appKey')
            $('#submit').trigger('click')
        }
        if (location.pathname === '/add-update.do') {
            var nsKey = location.search;
            var btn = $('a[onclick="createPramsMockJson()"]');
            btn.html('生成JSON');
            btn.parents('li.li-title').append('&nbsp; | <a class="deleteAllPrams" href="javascript:void(0)" onclick="createRequestObject2()">生成对象</a>');

            initFormEl('#configForm #groupId', nsKey);
            initFormEl('#configForm #artifactId', nsKey);
            initFormEl('#configForm #pakVersion', nsKey);
            initFormEl('#configForm #interface', nsKey);
            initFormEl('#configForm #method', nsKey);
            initFormEl('#configForm #interfaceName', nsKey);
            initFormEl('#configForm #methodName', nsKey);
            initFormEl('#configForm #dubboGroup', nsKey);
            initFormEl('#configForm #apiName', nsKey);

            initFormEl('#configForm #module', nsKey); // 模块
            // select2 特殊处理
            $('.select2-selection__rendered').html( $('#module option[value='+ $('#module').val() +']').html() )

            initFormEl('#configForm #app', nsKey); // 所属应用
            initFormEl('#configForm #skipLogin', nsKey);
            initFormEl('#configForm #env', nsKey);
            initFormEl('#configForm #apIversion', nsKey);
            initFormEl('#configForm #owner', nsKey);
            
            // initFormEl('#configForm #desc', nsKey); // 基本每个都不一样
            // initFormEl('#configForm #mockParam', nsKey); // 基本每个都不一样
            // initFormEl('#configForm #mockReturn', nsKey);  // 基本每个都不一样
        }
    }, 200)
})