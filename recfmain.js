$(document).ready(function () {
    var client = contentful.createClient({
        space: 'ju5zd1pqvz7r',
        accessToken: 'Lbt6FEumYh_oBOXVa0boT110z_1OK1c6nq9S4zopLGY'
    });

    client.getEntries().then(function (entries) {
        entries.items.forEach(function (entry) {
            const componentImgUrl = entry.fields.componentImage.fields.file.url;
            const componentClass = entry.fields.componentClass;
            const sysId = entry.sys.id;

            $(".content-body").append(`<div class="item ${componentClass}" data-sys="${sysId}" data-bs-toggle="offcanvas" data-bs-target="#panel"><img class="image" src="${componentImgUrl}" /></div>`);
        });
    });

    $(".content-body").on("click", ".item", function () {
        const dataSys = $(this).data("sys");
        setTimeout(function () {
            client.getEntry(dataSys).then(function (entry) {
                const componentName = entry.fields.componentName;
                const componentImgUrl = entry.fields.componentImage.fields.file.url;
                const metaDataHtml = documentToHtmlString(entry.fields.componentMetaData);

                updatePanel(componentName, componentImgUrl, metaDataHtml);
            });
        }, 300);
    });

    function updatePanel(name, imgUrl, metaData) {
        $("#title-panel").text(name);
        $('#thumbnail-panel').attr('src', imgUrl);

        $("#copyfigma").off("click").click(function () {
            document.addEventListener("copy", function (e) {
                e.clipboardData.setData("text/plain", name);
                e.clipboardData.setData('text/html', metaData);
                e.preventDefault();
            }, { once: true });

            document.execCommand("copy");
            showToast("Copying Successful");
        });
    }

    function toggleVisibility(targetClass) {
        $('.content-body .item').hide();
        const elementsToShow = (targetClass === "allCom") ? $('.content-body *') : $(`.content-body .${targetClass}`);

        elementsToShow.show();
        $("#div404").toggle(elementsToShow.length === 0);
    }

    $('.body-section .item').click(function () {
        const targetClass = $(this).data('target-class');
        toggleVisibility(targetClass);
    });

    function showToast(message) {
        Toastify({
            text: message,
            duration: 1000,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
        }).showToast();
    }
});