(function () {
    "use strict";

    console.log("reading js");


    window.addEventListener('load', function () {

        // Getting gallery from html
        const container = document.querySelector('.gallery-container');
        const gallery = document.querySelector('.gallery');

        // How fast the gallery moves
        const scrollSpeed = 1;

        // Repaeting gallery so it looks endless
        const items = Array.from(gallery.children);

        items.forEach(function (item) {
            const clone = item.cloneNode(true);
            gallery.appendChild(clone);
        });

        // Keep track of scrolling
        let scrollAmount = 0;
        let animationId;

        // Automatically scroll
        function autoScroll() {
            scrollAmount += scrollSpeed;

            // Start over when it reaches the end
            if (scrollAmount >= gallery.scrollWidth / 2) {
                scrollAmount = 0;
            }


            container.scrollLeft = scrollAmount;

            // Keep the animation going
            animationId = requestAnimationFrame(autoScroll);
        }

        // Auto scrolling when page loads
        autoScroll();

        // Stops when hover
        container.addEventListener('mouseenter', function () {
            cancelAnimationFrame(animationId);
        });

        // Resumes when no img is hovered
        container.addEventListener('mouseleave', function () {
            autoScroll();
        });
    });
})();