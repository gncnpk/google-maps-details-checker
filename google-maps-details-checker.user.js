// ==UserScript==
// @name         Google Maps Details Checker
// @namespace    https://github.com/gncnpk/google-maps-details-checker
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @version      0.0.1
// @description  Shows missing information when viewing details about a place on Google Maps.
// @match        https://*.google.com/maps/*@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @run-at       document-start
// @license      MIT
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    let oldHref = document.location.href;
    let spacer = document.createElement("div");
    spacer.className = "TFQHme ";
    spacer.id = "details-checker-missing-info-spacer"
    spacer.style = "margin-top: 10px;";

    function setPlaceStatus(status) {
        let placeHeader = document.getElementsByClassName("lMbq3e")[0];
        if (!placeHeader) {
            return;
        }
        let color;
        switch (status) {
            case "pass":
                color = "rgba(0,255,0,0.1)"
                break
            case "not_checked":
                color = "rgba(255,255,0,0.1)"
                break
            case "fail":
                color = "rgba(255,0,0,0.1)"
                break
        }
        document.getElementsByClassName("lMbq3e")[0].style.background = color
        Array.from(document.getElementsByClassName("RWPxGd")[0].children).forEach((e) => {
            e.style.background = color
        })
    }

    function checkPlace() {
        let isDetailsComplete = true;
        let placeDetailsContainer = null;
        if (document.location.href.includes("/place/")) {
            setPlaceStatus("not_checked");
            Array.from(document.getElementsByClassName("zSdcRe ")).forEach((e) => {
                if (e.innerText.split("\n")[0] === "Add missing information") {
                    isDetailsComplete = false;
                    placeDetailsContainer = e.parentElement;
                    placeDetailsContainer.insertBefore(e, e.parentElement.querySelector(".m6QErb.Pf6ghf.XiKgde.ecceSd.tLjsW "));
                }
            })

            Array.from(document.getElementsByClassName("MngOvd fontBodyMedium Hk4XGb zWArOe ")).forEach((e) => {
                let buttonText = e.innerText.split("\n")[1];
                if (!buttonText) {
                    return;
                }
                if (buttonText.includes("Add hours") || buttonText.includes("Add place's phone number") || buttonText.includes("Add website")) {
                    isDetailsComplete = false;
                    //e.style.background = "rgba(255,0,0,0.1)";
                    placeDetailsContainer = e.parentElement;
                    placeDetailsContainer.insertBefore(e, e.parentElement.querySelector(".m6QErb.Pf6ghf.XiKgde.ecceSd.tLjsW "));
                }
            })
            if (isDetailsComplete) {
                setPlaceStatus("pass");
            } else {
                placeDetailsContainer.insertBefore(spacer, placeDetailsContainer.querySelector(".m6QErb.Pf6ghf.XiKgde.ecceSd.tLjsW "));
                setPlaceStatus("fail");
            }
        }

    }

    document.addEventListener("DOMContentLoaded", function() {
        var bodyList = document.querySelector('body');

        var observer = new MutationObserver(function(mutations) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                checkPlace();
            }
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
    });
})();
