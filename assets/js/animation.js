function initAnimation() {

    const items = document.querySelectorAll("[data-fade]");

    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);

            }

        });

    }, {

        rootMargin:"0px 0px -12% 0px",
        threshold:0.08

    });

    items.forEach((item) => {

        observer.observe(item);

    });

}
