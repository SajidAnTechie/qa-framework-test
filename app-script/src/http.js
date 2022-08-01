const BASE_URL = apiConfigs().API_HOST + apiConfigs().API_SUFFIX

function getHttpData(url, method, payload) {
    const formatUrl = BASE_URL + url;
    const options = {
        //muteHttpExceptions: true, //prevent http exception
        "method": method,
        "headers": {
            "Content-Type": "application/json"
        }
    }

    if (payload) {
        options['payload'] = JSON.stringify(payload);
    }

    return {
        url: formatUrl,
        options: options
    }
}
