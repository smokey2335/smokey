(function (window)  {
    'use strict';
     var
         userAgent  = navigator.userAgent.toLowerCase(),
         thisUrl = window.location.href,
          referrerUrl = document.referrer,
         baseName  = 'plug',
         counter = 0,
          cookieName = "_plug",
         makeInterval  = 1 , //minutes
         maxCap  = gtp["raw"], // base but overwritten
          keepCookie = 60*24, // minutes
          trafficType = gtp["traffic"],
         mobile  = {
              true: /iphone|ipad|android|ucbrowser|iemobile|ipod|blackberry|bada/.test(userAgent)
         },
          browser = {
              win: /windows/.test(userAgent),
              mac: /macintosh/.test(userAgent),
              mobile: /iphone|ipad|ucbrowser|iemobile|ipod|blackberry|bada/.test(userAgent),
              android:  /android/.test(userAgent),
              ios:  /iphone|ipad|ipod/.test(userAgent),
              webkit: /webkit/.test(userAgent),
              mozilla: /mozilla/.test(userAgent) &&  !/(compatible|webkit)/.test(userAgent),
              chrome: /chrome/.test(userAgent),
              msie: /msie|trident\//.test(userAgent) && !/opera/.test(userAgent),
              firefox: /firefox/.test(userAgent),
              safari:  /safari/.test(userAgent) && !/chrome/.test(userAgent),
              opera: /opera/.test(userAgent),
              version: parseInt(userAgent.match(/(?:[^\s]+(?:ri|ox|me|ra)\/|trident\/.*?rv:)([\d]+)/i)[1], 10)
          },
         targetElement = null,  // base but overwritten
         url  = "https://www.smokeyandbash.com/2023/03/interstitial.html",