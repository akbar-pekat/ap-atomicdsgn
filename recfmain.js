$(document).ready(function () {
    var client = contentful.createClient({
        space: 'ju5zd1pqvz7r',
        accessToken: 'Lbt6FEumYh_oBOXVa0boT110z_1OK1c6nq9S4zopLGY'
    });

    client.getEntries({ content_type: 'components' }).then(function (entries) {
        entries.items.forEach(function (entry) {
            const { componentImage, componentClass } = entry.fields;
            const sysId = entry.sys.id;
            const componentImgUrl = componentImage.fields.file.url;

            $(".content-body").append(`<div class="item ${componentClass}" data-sys="${sysId}" data-bs-toggle="modal" data-bs-target="#componentModal"><img class="item__image" src="${componentImgUrl}"/></div>`);
        });

        $(".content-body").on("click", ".item", function () {
            const dataSys = $(this).data("sys");
            setTimeout(function () {
                client.getEntry(dataSys).then(updateModalContent);
            }, 300);
        });
    });

    client.getEntries({ content_type: 'componentMenu' }).then(function (entries) {
        entries.items.forEach(function (entry) {
            const { name, class: menuClass, description } = entry.fields;
            $(".section-components").append(`<div class="sidenav-item" data-name="${name}" data-desc="${description}" data-target-class="${menuClass}"><img class="sidenav-item__image" src="https://ui-avatars.com/api/?name=${name}&size=20&background=D7EDFF&color=0E73F6" /><div class="sidenav-item__title">${name}</div></div>`);
        });
    });

    function updateModalContent(entry) {
        const { componentName, componentImage, componentMetaData } = entry.fields;
        const metaDataHtml = documentToHtmlString(componentMetaData);

        $("#modalTitle").text(componentName);
        $('#modalThumbnail').attr('src', componentImage.fields.file.url);
        setupCopyToClipboard(componentName, metaDataHtml);
    }

    function setupCopyToClipboard(name, htmlData) {
        $("#copyFigma").off("click").click(function () {
            document.addEventListener("copy", function (e) {
                e.clipboardData.setData("text/plain", name);
                e.clipboardData.setData('text/html', htmlData);
                e.preventDefault();
                console.log("Successfully copied to the clipboard.");
            }, { once: true });
            document.execCommand("copy");
            showToast("Copying Successful");
        });
    }


    function toggleVisibility(targetClass) {
        $('.content-body .item').hide();

        if (targetClass === "allCom") {
            $('.content-body .item').show();
        } else {
            $(`.content-body .${targetClass}`).show();
        }

        const isContentVisible = $('.content-body .item:visible').length > 0;

        $("#div404").toggle(!isContentVisible);
        $(".content-body").show();
    }

    $(".sectionmenu").on("click", ".sidenav-item", function () {
        const targetClass = $(this).data('target-class');
        const headerText = $(this).data('name');
        toggleVisibility(targetClass);
        $("#header-text").text(headerText);
    });

    function showToast(message) {
        Toastify({
            text: message,
            duration: 1000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
        }).showToast();
    }
});