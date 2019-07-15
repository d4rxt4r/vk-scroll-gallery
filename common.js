var output_urls, additionalContent, addContentButton, gallery;

addContentButton = document.getElementById("addContent");

var openFile = function (event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        output_urls = text;
        additionalContent = output_urls.split(",");
        additionalContent = [...new Set(additionalContent)];
        additionalContent.map((e, i) => {
            return (
                '<li><a target="_blank" href="' +
                e +
                '"><img class="lazy" data-src="' +
                e +
                '"><div class="num">' + ++i + '</div></a></li>'
            );
        });
        addContentButton.classList.toggle("hidden");
    };
    reader.readAsText(input.files[0]);
};

(function () {
    var count = 0,
        target,
        num,
        waypointNum = 1;

    var ll = new LazyLoad({
        container: document.querySelector('.results'),
        elements_selector: "img.lazy"
    });

    var target = document.querySelector("#results ul");
    var num = document.querySelector("#fastTravelNum");

    function loadContent() {
        if (count === additionalContent.length) {
            return;
        }

        target.innerHTML += additionalContent[count];
        ll.update();

        addContentButton.disabled =
            ++count >= additionalContent.length;
        num.value = count + 1;
    }

    function createNewWp(n) {
        var newWp = document.createElement('div');
        newWp.innerText = 'Loading more...';
        newWp.classList.add('spacer');
        newWp.id = 'waipoint-' + n.toString();
        document.body.append(newWp);

        var wp = new Waypoint.Inview({
            element: newWp,
            enter: function(direction) {
                console.log(n + '-th waypoint triggered with d:' + direction);
                if (direction === 'down') {
                    for (i = 0; i < 8; i++) loadContent();
                }
                wp.destroy();
                newWp.remove();
                createNewWp(++waypointNum)
            }
        });
    }

    fastTravelButton.addEventListener("click", () => {
        count = num.value - 1;
    });

    addContentButton.addEventListener("click", () => {
        for (i = 0; i < 8; i++) loadContent();
        addContentButton.classList.toggle("hidden");
        // var inview = new Waypoint.Inview({
        //     element: document.getElementById('spacer'),
        //     enter: function(direction) {
        //       console.log('Enter triggered with direction ' + direction);
        //       for (i = 0; i < 4; i++) loadContent();
        //     }
        // });
        createNewWp(waypointNum);
    });

    window.onscroll = function (ev) {
        document.querySelectorAll('.loaded').forEach(e => { e.classList.remove('lazy') });
        // if (
        //     window.innerHeight + window.scrollY >=
        //     document.body.offsetHeight - 50 //0
        // ) {
        //     for (i = 0; i < 4; i++) loadContent();
        // }
    };
})();