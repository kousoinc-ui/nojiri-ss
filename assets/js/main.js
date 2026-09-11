document.addEventListener("DOMContentLoaded", () => {

    initHeader();

    initMenu();

    initAnimation();

    initDecorativeMotion();

    initHeroVideo();

    initScrollVideos();

    initFacilityTabs();

    initContactForm();

    /* ヒーローテキストの段階フェードインを開始する
       （初期スタイル適用後に発火させるため一拍置く） */
    setTimeout(() => {
        document.body.classList.add("is-loaded");
    }, 100);

});
