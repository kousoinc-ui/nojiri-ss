function initFacilityTabs() {

    const root = document.querySelector("[data-facility-tabs]");

    if (!root) return;

    const tabs = Array.from(root.querySelectorAll("[data-facility-tab]"));
    const panels = Array.from(root.querySelectorAll("[data-facility-panel]"));

    const activate = (targetName, shouldFocus = false) => {

        tabs.forEach((tab) => {
            const isActive = tab.dataset.facilityTab === targetName;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
            tab.setAttribute("tabindex", isActive ? "0" : "-1");

            if (isActive && shouldFocus) {
                tab.focus();
            }
        });

        panels.forEach((panel) => {
            const isActive = panel.dataset.facilityPanel === targetName;
            panel.classList.toggle("is-active", isActive);
            panel.hidden = !isActive;
        });

    };

    tabs.forEach((tab, index) => {

        tab.setAttribute("tabindex", tab.classList.contains("is-active") ? "0" : "-1");

        tab.addEventListener("click", () => {
            activate(tab.dataset.facilityTab);
        });

        tab.addEventListener("keydown", (event) => {
            const lastIndex = tabs.length - 1;
            let nextIndex = null;

            if (event.key === "ArrowRight") {
                nextIndex = index === lastIndex ? 0 : index + 1;
            }

            if (event.key === "ArrowLeft") {
                nextIndex = index === 0 ? lastIndex : index - 1;
            }

            if (event.key === "Home") {
                nextIndex = 0;
            }

            if (event.key === "End") {
                nextIndex = lastIndex;
            }

            if (nextIndex === null) return;

            event.preventDefault();
            activate(tabs[nextIndex].dataset.facilityTab, true);
        });

    });

}
