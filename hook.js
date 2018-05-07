    
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

$(function () {
    setTimeout(function () {
        if (location.pathname === '/list.do') {
            initFormEl('#env')
            initFormEl('#app')
            initFormEl('#module')
            initFormEl('#apiName')
            initFormEl('#apiVersion')
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
    }, 200)
})