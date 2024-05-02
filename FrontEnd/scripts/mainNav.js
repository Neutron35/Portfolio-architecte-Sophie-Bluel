export function mainNavStyle() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    const mainNavTabs = document.querySelectorAll(".main-nav-tabs");

    mainNavTabs.forEach(function(tab) {
        if (tab.getAttribute("href") === page) {
            tab.classList.add("active");
        };
    });
};