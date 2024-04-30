export function mainNavStyle() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    const mainNavTabs = document.querySelectorAll("header nav li a");

    mainNavTabs.forEach(function(tab) {
        if (tab.getAttribute("href") === page) {
            tab.classList.add("active");
        };
    });
};