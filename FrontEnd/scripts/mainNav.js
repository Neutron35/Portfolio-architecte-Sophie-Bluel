export function mainNavStyle() {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    const mainNavTabs = document.querySelectorAll("header nav li a");

    mainNavTabs.forEach(function(tab) {
        if (tab.getAttribute("href") === page) {
            tab.classList.add("active");
        };
    });
};