    
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
  
  function isUndefined(val) {
    return isXX(val, 'Undefined')
  }
  
  function isEmpty(val) {
    return isUndefined(val) || isNull(val)
  }
  
  function isNotEmpty(val) {
    return !isEmpty(val)
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
        localStorage.setItem(cacheKey, e.target.value)
    })
}

function createRequestObject(){
    var temp = $("#mockParam").val();
    if(temp == ''){
        showMessage('生成失败，JSON不能为空',2);
        return;
    }
    var tempJSON;
    try {
        tempJSON=JSON.parse(temp);
    } catch(e) {
        console.log('error：'+temp+'!!!'+e);
        showMessage('生成失败，请检查输入的值是否合法',2);
        return;
    }
    $("#pramsBox").html("");
    var changeJson = changeJsonToClassMeta(tempJSON);
    reBackHtml(changeJson, 0, 'pramsBox');
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
            var apiId = location.search
            initFormEl('#userName')
            initFormEl('#appv')
            initFormEl('#deviceId')
            initFormEl('#model')
            initFormEl('#os')
            initFormEl('#password')
            initFormEl('#osv')
            initFormEl('#data', apiId)
            initFormEl('#appKey')
            $('#submit').trigger('click')
        }
        if (location.pathname === '/add-update.do') {
            $('a[onclick="createPramsMockJson()"]').html('生成JSON')
            $('a[onclick="createPramsMockJson()"]').parents('li.li-title').append('&nbsp; | <a class="deleteAllPrams" href="javascript:void(0)" onclick="createRequestObject()">生成对象</a>')
            $('#configForm')
        }
    }, 200)
})