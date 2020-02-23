var output_urls, additionalContent, addContentButton, gallery;

addContentButton = document.getElementById("addContent");

var openTxtFile = function (event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        output_urls = text;
        additionalContent = output_urls.split(",");
        additionalContent = [...new Set(additionalContent)].map((e, i) => {
            return (
                '<li><a target="_blank" href="' +
                e +
                '"><img class="lazy" data-src="' +
                e +
                '"><div class="num">' + ++i + '</div></a></li>'
            );
        });
        console.log('Total urls = ' + additionalContent.length);
        var ttl = document.getElementById('totalImg');
        ttl.innerText = 'total = ' + additionalContent.length;
        addContentButton.classList.toggle("hidden");
    };
    reader.readAsText(input.files[0]);
};

var openHtmlFile = function (event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var link = document.getElementById('downloadBtn');
        var html = reader.result;
        var dom = document.createElement('html');
        var links = [];
        dom.innerHTML = html;
        linksNodes = dom.querySelectorAll('.attacment a[href*=jpg]');
        dom.remove();
        linksNodes.forEach((e, i) => {
            links[i] = e.attributes.href.value;
        });
        var textFile = null;
        var data = new Blob([links.toString()], { type: 'text/plain' });
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        link.href = textFile;
        link.style.display = 'inline-block';
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
            enter: function (direction) {
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
        target.innerHTML = null;
        for (i = 0; i < 8; i++) loadContent();
        addContentButton.classList.toggle("hidden");
        createNewWp(waypointNum);
    });

    // window.onscroll = function (ev) {
    //     document.querySelectorAll('.loaded').forEach(e => { e.classList.remove('lazy') });
    // };
})();