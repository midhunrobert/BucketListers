document.addEventListener("DOMContentLoaded", function () {
    var main = document.querySelector("main");
    var columns = document.querySelectorAll(".column img");
    var lastScrollTop = 0;

    function blurImages() {
        var st = window.pageYOffset || document.documentElement.scrollTop;

        if (st > lastScrollTop) {
            // Scrolling down
            columns.forEach(function (image) {
                var rect = image.getBoundingClientRect();
                var show = rect.top < window.innerHeight - 50 && rect.bottom >= 0;
                image.parentElement.classList.toggle("show-text", show);

                // Adjust blur based on scroll position
                var blurValue = Math.min(2, st / 10); // You can adjust the blur strength here
                image.style.filter = "blur(" + blurValue + "px)";
            });
        } else {
            // Scrolling up
            columns.forEach(function (image) {
                image.style.filter = "none"; // Reset blur when scrolling up
                image.parentElement.classList.remove("show-text");
            });
        }

        lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
    }

    document.addEventListener("scroll", blurImages);
    blurImages(); // Initial check
});