(() => {
    "use strict";

    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector("[data-header]");
    const progress = document.querySelector(".scroll-progress span");
    const menuButton = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const revealItems = document.querySelectorAll("[data-reveal]");
    const motionVideos = document.querySelectorAll("video[data-autoplay]");
    const parallaxItems = document.querySelectorAll("[data-parallax]");
    const horizontal = document.querySelector("[data-horizontal]");
    const horizontalTrack = document.querySelector("[data-horizontal-track]");
    const horizontalCurrent = document.querySelector("[data-horizontal-current]");
    const horizontalLine = document.querySelector("[data-horizontal-line]");

    let scrollQueued = false;
    let horizontalTravel = 0;

    if (typeof initContactForm === "function") initContactForm();

    const finishLoading = () => body.classList.add("is-ready");
    window.addEventListener("load", () => window.setTimeout(finishLoading, 250), { once: true });
    window.setTimeout(finishLoading, 1800);

    const setMenu = (open) => {
        if (!menuButton || !mobileMenu) return;
        menuButton.classList.toggle("is-open", open);
        mobileMenu.classList.toggle("is-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
        body.classList.toggle("menu-open", open);
    };

    menuButton?.addEventListener("click", () => setMenu(!menuButton.classList.contains("is-open")));
    mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenu(false);
    });

    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting && !reducedMotion.matches) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.18 });
        motionVideos.forEach((video) => videoObserver.observe(video));
    }

    const measureHorizontal = () => {
        if (!horizontal || !horizontalTrack) return;
        if (window.innerWidth <= 768 || reducedMotion.matches) {
            horizontal.style.height = "auto";
            horizontalTrack.style.transform = "none";
            horizontalTravel = 0;
            return;
        }
        horizontalTravel = Math.max(0, horizontalTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
        horizontal.style.height = `${horizontalTravel + window.innerHeight * 1.3}px`;
    };

    const updateHorizontal = () => {
        if (!horizontal || !horizontalTrack || window.innerWidth <= 768 || reducedMotion.matches) return;
        const rect = horizontal.getBoundingClientRect();
        const range = Math.max(1, horizontal.offsetHeight - window.innerHeight);
        const ratio = Math.min(1, Math.max(0, -rect.top / range));
        horizontalTrack.style.transform = `translate3d(${-horizontalTravel * ratio}px, 0, 0)`;
        if (horizontalLine) horizontalLine.style.transform = `scaleX(${ratio})`;
        if (horizontalCurrent) {
            const index = Math.min(6, Math.floor(ratio * 5.999) + 1);
            horizontalCurrent.textContent = String(index).padStart(2, "0");
        }
    };

    const updateParallax = () => {
        if (window.innerWidth <= 768 || reducedMotion.matches) {
            parallaxItems.forEach((item) => item.style.setProperty("--parallax-y", "0px"));
            return;
        }
        parallaxItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const factor = Number.parseFloat(item.dataset.parallax || "0");
            const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * factor;
            item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
        });
    };

    const updatePage = () => {
        const top = window.scrollY;
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        header?.classList.toggle("is-scrolled", top > 40);
        if (progress) progress.style.transform = `scaleX(${Math.min(1, top / scrollable)})`;
        updateHorizontal();
        updateParallax();
        scrollQueued = false;
    };

    const requestUpdate = () => {
        if (scrollQueued) return;
        scrollQueued = true;
        window.requestAnimationFrame(updatePage);
    };

    const syncMobileMachineCounter = () => {
        if (!horizontalTrack || !horizontalCurrent || window.innerWidth > 768) return;
        const cards = [...horizontalTrack.querySelectorAll(".machine-card")];
        if (!cards.length) return;
        const trackCenter = horizontalTrack.scrollLeft + horizontalTrack.clientWidth / 2;
        let nearest = 0;
        let nearestDistance = Infinity;
        cards.forEach((card, index) => {
            const center = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(center - trackCenter);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = index;
            }
        });
        horizontalCurrent.textContent = String(nearest + 1).padStart(2, "0");
        if (horizontalLine) horizontalLine.style.transform = `scaleX(${(nearest + 1) / cards.length})`;
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", () => {
        measureHorizontal();
        requestUpdate();
        if (window.innerWidth > 1024) setMenu(false);
    });
    horizontalTrack?.addEventListener("scroll", () => window.requestAnimationFrame(syncMobileMachineCounter), { passive: true });
    reducedMotion.addEventListener?.("change", () => {
        measureHorizontal();
        requestUpdate();
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
        });
    });

    measureHorizontal();
    updatePage();
    syncMobileMachineCounter();
})();
