// v2.8
var ssrData = {};

function getSSrData() {
    if (typeof window === 'undefined') {
        return {};
    }
    var parsedRenderData;
    try {
        var insertScript = document.getElementById('RENDER_DATA');
        var renderData = insertScript && insertScript.innerText || '{}';
        parsedRenderData = JSON.parse(decodeURIComponent(renderData)) || {};
        // @ts-ignore
        window.SSR_RENDER_DATA_DOC = parsedRenderData;
    } catch (e) {
        // @ts-ignore
        window.SSR_RENDER_DATA_DOC = {};
    }

    var tcc;
    var videoFilterType;
    var globalwid;
    var webId;
    var enableRecommendCache;
    var recommendFeedCache;
    var afterLcpExecute;
    var ffDanmakuStatus = 0;
    var danmakuSwitchStatus = 0;

    for (var renderKey in parsedRenderData) {
        const val = parsedRenderData[renderKey] || {};
        if (val.tccConfig) {
            tcc = val.tccConfig
            if (tcc && tcc.enable_recommend_cache) {
                enableRecommendCache = tcc.enable_recommend_cache.enable;
            }
        }
        if (val.videoTypeSelect !== undefined) {
            videoFilterType = val.videoTypeSelect;
        }
        if (val.recommendFeedCache !== undefined) {
            recommendFeedCache = val.recommendFeedCache;
        }
        if (val.globalwid) {
            globalwid = val.globalwid;
        }
        if (val.odin && val.odin.user_unique_id) {
            webId = val.odin.user_unique_id;
        }
        if (val.abTestData) {
            afterLcpExecute = val.abTestData.afterLcpExecute
        }
        if (val.ffDanmakuStatus) {
            ffDanmakuStatus = (val.ffDanmakuStatus && navigator?.hardwareConcurrency > 4) ? 1 : 0;
        }
        if (val.danmakuSwitchStatus) {
            danmakuSwitchStatus = val.danmakuSwitchStatus;
        }

    }
    return {
        tcc: tcc,
        globalwid: globalwid || '',
        webId: webId || '',
        videoFilterType: videoFilterType,
        enableRecommendCache: enableRecommendCache,
        recommendFeedCache: recommendFeedCache,
        afterLcpExecute: afterLcpExecute,
        done: tcc !== undefined && videoFilterType !== undefined || false,
        ffDanmakuStatus: ffDanmakuStatus,
        danmakuSwitchStatus: danmakuSwitchStatus
    }
}


function getCommonParams() {
    var safeGetParams = function (obj, key) {
        return obj && obj[key] || '';
    }

    var getPlatform = function () {
        var userAgentInfo = safeGetParams(navigator, 'userAgent');
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        for (var i = 0; i < Agents.length; i++) {
            var findIndex = userAgentInfo.indexOf(Agents[i]);
            if (findIndex !== -1) {
                return Agents[i];
            }
        }
        return 'PC';
    }

    var getIsInClient = function () {
        var ua = safeGetParams(navigator, 'userAgent');
        return /(awemePcClient)|(electron)/i.test(ua);
    }

    var getPCClientType = function () {
        var platform = safeGetParams(navigator, 'platform');
        if (getIsInClient()) {
            if (platform === 'Mac68K' || platform === 'MacPPC' || platform === 'Macintosh' || platform === 'MacIntel') {
                return 3;
            } else {
                return 2;
            }
        }
        return 1;
    }

    var getShareAwemeId = function () {
        var shareAwemeId = '';
        var search = window.location && window.location.search || '';
        var matchedVid = search.match(/vid=([0-9]+)?/);
        if (matchedVid && matchedVid[1]) {
            shareAwemeId = matchedVid[1];
        }
        return shareAwemeId;
    }

    var getCachedAwemeId = function () {
        var cachedId;
        var expireTime;
        var cacheValue = window.localStorage.getItem('feed_cache_awemeid_' + ssrData.webId + '_' + ssrData.videoFilterType);

        // 如果是全部视频且无缓存，可以再看下横视频是否有缓存
        if (ssrData.videoFilterType === 0 && !cacheValue) {
            cacheValue = window.localStorage.getItem('feed_cache_awemeid_' + ssrData.webId + '_1');
        }

        if (cacheValue && ssrData.enableRecommendCache && ssrData.recommendFeedCache !== 0) {
            var arr = cacheValue.split('_');
            expireTime = arr[1];
            if (Date.now() <= Number(expireTime)) {
                cachedId = arr[0];
                localStorage.setItem('RECOMMEND_USE_CACHE', 1);
            } else {
                localStorage.setItem('RECOMMEND_USE_CACHE', 2);
            }
        }
        return cachedId;
    }

    var getUgSourceAndCid = function () {
        var ug_source = '';
        var creative_id = '';
        var search = window.location && window.location.search || '';
        var match_ug_source = search.match(/ug_source=([^&]+)/);
        var match_creative_id = search.match(/creative_id=([^&]+)/);
        if (match_ug_source && match_ug_source[1] && match_creative_id && match_creative_id[1]) {
            ug_source = match_ug_source[1];
            creative_id = match_creative_id[1];
        }
        return {
            ug_source,
            creative_id
        };
    }

    var getReqRawData = function () {
        var data = {};

        // 获取ug信息
        var ugSourceAndCid = getUgSourceAndCid();
        data.seo_info = window.document.referrer;
        data.ug_info = ugSourceAndCid.ug_source || '';
        data.is_client = getIsInClient();
        data.ff_danmaku_status = ssrData.ffDanmakuStatus,
            data.danmaku_switch_status = ssrData.danmakuSwitchStatus
        return JSON.stringify(data);
    };

    var connection = safeGetParams(navigator, 'connection');
    // @ts-ignore
    var uaParserMethod = new UAParser();
    var uaParserCase = uaParserMethod.getResult() || {};

    var ugSourceAndCid = getUgSourceAndCid();

    var commomParams = {
        device_platform: 'webapp',
        aid: 6383,
        channel: 'channel_pc_web',
        tag_id: '',
        ug_source: ugSourceAndCid.ug_source,
        creative_id: ugSourceAndCid.creative_id,
        count: 10,
        refresh_index: 1,
        video_type_select: ssrData.videoFilterType || 0,
        aweme_pc_rec_raw_data: getReqRawData(),
        globalwid: ssrData.globalwid || '',
        version_code: '170400',
        version_name: '17.4.0',
        pull_type: 0, // 首次请求为0 for 广告

        cookie_enabled: safeGetParams(navigator, 'cookieEnabled'),
        screen_width: safeGetParams(screen, 'width'),
        screen_height: safeGetParams(screen, 'height'),
        browser_language: safeGetParams(navigator, 'language'),
        browser_platform: safeGetParams(navigator, 'platform'),
        browser_name: uaParserCase.browser && uaParserCase.browser.name,
        browser_version: uaParserCase.browser && uaParserCase.browser.version,
        browser_online: safeGetParams(navigator, 'onLine'),
        engine_name: uaParserCase.engine && uaParserCase.engine.name,
        engine_version: uaParserCase.engine && uaParserCase.engine.version,
        os_name: uaParserCase.os && uaParserCase.os.name,
        os_version: uaParserCase.os && uaParserCase.os.version || '',
        cpu_core_num: safeGetParams(navigator, 'hardwareConcurrency'),
        device_memory: safeGetParams(navigator, 'deviceMemory'),
        platform: getPlatform(),
        downlink: connection && connection.downlink,
        effective_type: connection && connection.effectiveType,
        round_trip_time: connection && connection.rtt,
        pc_client_type: getPCClientType(),

    };

    var tabFeedUrl = 'https://www.douyin.com/aweme/v1/web/tab/feed/?'
    var awemeDetailUrl = 'https://www.douyin.com/aweme/v1/web/aweme/detail/?'
    for (var key in commomParams) {
        tabFeedUrl = tabFeedUrl + key + '=' + commomParams[key] + '&';
        awemeDetailUrl = awemeDetailUrl + key + '=' + commomParams[key] + '&';
    }
    tabFeedUrl = tabFeedUrl.substring(0, tabFeedUrl.length - 1);
    awemeDetailUrl = awemeDetailUrl.substring(0, awemeDetailUrl.length - 1);
    var awemeId = getShareAwemeId() || getCachedAwemeId();
    if (awemeId) {
        awemeDetailUrl += '&aweme_id=' + awemeId;
    } else {
        awemeDetailUrl = '';
    }
    tabFeedUrl = encodeURI(tabFeedUrl);
    awemeDetailUrl = encodeURI(awemeDetailUrl);
    return {
        tabFeedUrl,
        awemeDetailUrl
    };
}

function request(url, statusKey, logIDKey) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error('TIMEOUT'));
        }, 8000);
        fetch(url)
            .then(function (response) {
                var headers = response.headers;
                if (headers.get('x-vc-bdturing-parameters') || headers.get('x-whale-throughput-abort-data')) {
                    localStorage.setItem(logIDKey, headers.get('x-tt-logid') + '');
                    reject(new Error('RISK_CONTROL'));
                } else {
                    localStorage.setItem(statusKey, response.status + '');
                    localStorage.setItem(logIDKey, headers.get('x-tt-logid') + '');
                    return response.text();
                }
            })
            .then(function (resText) {
                if (resText) {
                    resolve(resText);
                } else {
                    reject(new Error("The Response is Empty"));
                }
            })
            .catch(function (err) {
                reject(err);
            })
    });
}

function initWebmsSdk() {
    if (typeof window !== 'undefined' && window.byted_acrawler) {
        try {
            window.byted_acrawler.init({
                aid: 6383,
                isSDK: false,
                boe: false,
                v: true,
                ddrt: ssrData.afterLcpExecute ? 7 : 3,
                enablePathList: ['/webcast/*', '/aweme/v1/*', '/aweme/v2/*', '/v1/message/send', '/live/*'],
                region: 'cn',
            });
            window.bytedAcrawlerInited = true;
        } catch (e) {
            console.error('webmssdk failed to init!!!', e);
        }
    }
}

function preFeedRequest() {
    try {
        ssrData = getSSrData();
        initWebmsSdk();
        if (typeof window === 'undefined' || (window.location && window.location.pathname !== '/')
            || typeof Promise !== 'function' || typeof fetch !== 'function' || !ssrData.done) {
            return;
        }
        const urlObject = getCommonParams();
        window.tabFeedPrefetch = request(urlObject.tabFeedUrl, 'RECOMMENTFETCHSTATUS', 'RECOMMENTFETCHLOGID');

        if (urlObject.awemeDetailUrl) {
            window.awemeDetailPrefetch = request(urlObject.awemeDetailUrl, 'RECOMMEND_AWEME_DETAIL_STATUS', 'RECOMMEND_AWEME_DETAIL_LOGID');
        }
    } catch (e) {
        window.tabFeedPrefetch = null;
        window.awemeDetailPrefetch = null;
        localStorage.setItem('RECOMMENTFETCHERROR', e && e.message);
    }
}

preFeedRequest();

Object.defineProperty(window,)
