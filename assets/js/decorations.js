function initDecorativeMotion() {

    const decorations = document.querySelectorAll("[data-parallax]");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!decorations.length || reducedMotion.matches) return;

    let ticking = false;

    const update = () => {

        const viewportHeight = window.innerHeight;

        decorations.forEach((decoration) => {

            const rect = decoration.getBoundingClientRect();

            const center = rect.top + rect.height / 2;

            const distance = (center - viewportHeight / 2) / viewportHeight;

            const offset = Math.max(-1, Math.min(1, distance)) * -28;

            decoration.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);

        });

        ticking = false;

    };

    const requestUpdate = () => {

        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(update);

    };

    update();

    window.addEventListener("scroll", requestUpdate, { passive: true });

    window.addEventListener("resize", requestUpdate);

}
