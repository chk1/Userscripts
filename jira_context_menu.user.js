// ==UserScript==
// @name         Improve JIRA context menu
// @namespace    http://tampermonkey.net/
// @version      1.66
// @description  Because context menus should not be skyscrapers
// @author       localh0rzd
// @updateURL    https://github.com/localh0rzd/Userscripts/raw/master/jira_context_menu.user.js
// @match        http*://*/secure/RapidBoard.jspa*
// @grant GM_addStyle
// ==/UserScript==

GM_addStyle(".ghx-avatar-img { width: 40px !important; height: 40px !important; }")
let view = ""
let mouseDown = false;
let overlayInterval;
let stylesInterval;
const setStyles = () => {
    if(!mouseDown) {
        const elements = document.querySelectorAll(".ghx-columns, .ghx-column-headers, .ghx-zone-row, .ghx-zone-table")
        /*
        if(elements.length > 0) {
            view = location.href.match(/view=\w+(?!&)/g)[0]
        }
        */
        elements.forEach(x => x.style.display = "inline-table")
    }
}
const callback = (mutationsList, observer) => {
    for(const mutation of mutationsList) {
        if (mutation.target.id == 'cp-image-preview') {
            mutation.target.addEventListener("click", e => document.querySelector("button#cp-control-panel-close").click())
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(document.body, {childList: true, subtree: true });

document.addEventListener("contextmenu", e => {
    try{
        const menu = document.querySelector("#gh-ctx-menu-trigger_drop");
        menu.style.overflowY = "scroll"
        if(e.clientY > (window.innerHeight / 2)){
            menu.style.top = `${e.clientY - 400}px`
        } else {
            menu.style.top = `${e.clientY}px`
        }
        menu.style.height = "400px"
    } catch(error) {
        console.warn(error)}
    })

window.addEventListener("mousedown", e => {
    mouseDown = true;
    overlayInterval = setInterval(() => {
        console.warn("overlayInterval")
        let elem = document.querySelector(".ghx-zone-overlay-table")
        if(elem) {
            elem.style.display = "inline-table"
            console.warn("style set")
            clearInterval(overlayInterval)
            clearInterval(stylesInterval)
        }
        else if(!e.target.closest(".js-detailview")){
            // Nothing to do here
            clearInterval(overlayInterval)
        }
    }, 5)

})
window.addEventListener("mouseup", e => {
    mouseDown = false;
    view = "";
    clearInterval(overlayInterval)
    stylesInterval = setInterval(setStyles, 50)
})

stylesInterval = setInterval(setStyles, 50)