"use strict";angular.module("app.config").config(["$ocLazyLoadProvider",function(e){var d="/public/libs/",o="/bower_components/";e.config({debug:!1,events:!1,modules:[{name:"akoenig.deckgrid",files:[o+"angular-deckgrid/angular-deckgrid.js",d+"css/deckgrid.css"]},{name:"d3",files:[o+"d3/d3.js"]},{name:"showdown",files:[o+"showdown/compressed/Showdown.js"]}]})}]);