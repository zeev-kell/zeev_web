"use strict";angular.module("app.config").config(["$logProvider",function(n){n.debugEnabled(!0)}]).config(["$httpProvider","cfpLoadingBarProvider",function(n,r){r.includeSpinner=!0,r.includeBar=!0,r.parentSelector="#loading-bar-container",n.interceptors.push("httpInterceptor")}]);