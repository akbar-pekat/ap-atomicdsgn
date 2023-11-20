$(document).ready(function () {
    var client = contentful.createClient({
        space: 'ju5zd1pqvz7r',
        accessToken: 'Lbt6FEumYh_oBOXVa0boT110z_1OK1c6nq9S4zopLGY'
    });
    client.getEntries({
        content_type: 'components',
    }).then(function (entries) {
        entries.items.forEach(function (entry) {
            var ComponentImg = entry.fields.componentImage.fields.file.url;
            var ComponentClass = entry.fields.componentClass;
            var sys = entry.sys.id;
            $(".content-body").append('<div class="item ' + ComponentClass + '" data-sys="' + sys + '" data-bs-toggle="modal" data-bs-target="#componentModal"><img class="item__image" src="' + ComponentImg + '"/></div>');
        });


        $(".content-body .item").click(function (event) {
            var datasys = $(this).attr("data-sys");
            setTimeout(function () {
                client.getEntry(datasys).then(function (entry) {
                    var ComponentName = entry.fields.componentName;
                    var ComponentImg = entry.fields.componentImage.fields.file.url;
                    var ComponentCode = entry.fields.componentMetaData;
                    var MetaData = documentToHtmlString(ComponentCode);
                    $("#modalTitle").text(ComponentName);
                    $('#modalThumbnail').attr('src', ComponentImg);
                    $("#copyFigma").click(function () {
                        document.addEventListener("copy",
                            function (e) {
                                e.clipboardData.setData("text/plain", ComponentName);
                                e.clipboardData.setData('text/html', MetaData);
                                e.preventDefault();
                                console.log("Successfully copied to the clipboard.");
                            },
                            { once: true }
                        );
                        document.execCommand("copy");
                        Toastify({
                            text: "Copying Successful",
                            duration: 1000,
                            close: true,
                            gravity: "bottom",
                            position: "right",
                            stopOnFocus: true,
                        }).showToast();
                    });
                });
            }, 300);

        });
    });

    client.getEntries({
        content_type: 'componentMenu',
    }).then(function (entries) {
        entries.items.forEach(function (entry) {
            var menuName = entry.fields.name;
            var menuClass = entry.fields.class;
            var menuDesc = entry.fields.description;
            $(".section-components").append('<div class="sidenav-item" data-name="'+menuName+'" data-desc="'+menuDesc+'" data-target-class="'+menuClass+'"><img class="sidenav-item__image" src="https://ui-avatars.com/api/?name='+menuName+'&size=20&background=D7EDFF&color=0E73F6" /><div class="sidenav-item__title">'+menuName+'</div></div>');
        });
    });

    function toggleVisibilityReverse(targetClass) {
        document.querySelectorAll('.content-body .item').forEach(function (element) {
            element.style.display = 'none';
        });

        var elementsToShow = document.querySelectorAll('.content-body .' + targetClass);
        var elementsCount = elementsToShow.length;

        if (elementsCount === 0) {
            $("#div404").show();
            $(".content-body").hide();
        } else {
            $("#div404").hide();
            $(".content-body").show();
        }

        if (targetClass === "allCom") {
            document.querySelectorAll('.content-body *').forEach(function (element) {
                element.style.display = '';
                $("#div404").hide();
                $(".content-body").show();
            });
        } else {
            //var elementsToShow = document.querySelectorAll('.content-body .' + targetClass);
            elementsToShow.forEach(function (element) {
                element.style.display = '';
            });
        }
    }

    setTimeout(function () {
        document.querySelectorAll('.sectionmenu .sidenav-item').forEach(function (menuItem) {
            menuItem.addEventListener('click', function () {
                var targetClass = this.getAttribute('data-target-class');
                toggleVisibilityReverse(targetClass);
                $("#header-text").text(this.getAttribute('data-name'));
            });
        });
    }, 1000);
});