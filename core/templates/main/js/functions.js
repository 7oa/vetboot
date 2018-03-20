/*для tablesorterPager
 jQuery.browser = {};
 (function () {
 jQuery.browser.msie = false;
 jQuery.browser.version = 0;
 if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
 jQuery.browser.msie = true;
 jQuery.browser.version = RegExp.$1;
 }
 })();*/
//Переключение вкладок
/*$(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        // сохраним последнюю вкладку
        localStorage.setItem('lastTab', $(this).attr('href'));
    });

    //перейти к последней вкладки, если она существует:
    var lastTab = localStorage.getItem('lastTab');
    if (lastTab) {
        $('a[href=' + lastTab + ']').tab('show');
    } else
    {
        // установить первую вкладку активной если lasttab не существует
        $('a[data-toggle="tab"]:first').tab('show');
    }
});*/
//Перевод в числовой формат
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
            };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
                .join('0');
    }
    return s.join(dec);
}

$(document).ready(function () {

    $(".stock__item a").fancybox({
        'transitionIn'	:	'elastic',
        'transitionOut'	:	'elastic',
        'speedIn'		:	600,
        'speedOut'		:	200,
        'overlayShow'	:	true,
        'hideOnContentClick' : true,
        'showCloseButton' : true,
        'titleShow' : 'false',
        'centerOnScroll' : 'true',
        'padding' : 0,
    });

    var basketUri = "/ajax/basketActions.php";
    var orderUri = "/ajax/orderActions.php";
    var catalogUri = "/ajax/catalog.php";
    var userUri = "/ajax/userActions.php";
    var favoritUri = "/ajax/favoritActions.php";
    hide_button();
    // Дата в заказе
    $('#changeContactNoticeEmail').checkboxpicker({offLabel: "Нет", onLabel: "Да"});
    $('#changeContactNoticePhone').checkboxpicker({offLabel: "Нет", onLabel: "Да"});
    $(function () {
        $('.selectDate').datetimepicker(
                {pickTime: false, language: 'ru'}
        );
    });
	
    //переключение доставки
    $(document).on("change","input[type=radio][name=deliveryRadios]", function() {
        if (this.value == '2') $(".shipmentCompanyBlock").show();
        else $(".shipmentCompanyBlock").hide();
		if (this.value == '1') $(".shipmentAddressBlock").show();
		else $(".shipmentAddressBlock").hide();
    });
	

	//фикс дергания хедера и футера
	
	$(".modal").on("show.bs.modal", function(){
		var documentWidth = parseInt($(".wrapper").width());
		var windowsWidth = parseInt(window.innerWidth);
		//var position = parseInt($("#scrollup").css("right"));
		var scrollbarWidth = windowsWidth - documentWidth;
		$(".fix").css({'right': scrollbarWidth});
		$("#scrollup").css({'right': 10+scrollbarWidth});
	});

	$(".modal").on("hidden.bs.modal", function(){
		$(".fix").css({'right': "0"});
		$("#scrollup").css({'right': "10px"});
	});
	
	//сортировка таблиц
	function fn_sort() {
        $("#catalogSort")
                .tablesorter({
                    sortList: [[0, 0]],
                    headers: {2: {sorter: false}, 3: {sorter: false}, 4: {sorter: false}},
                });
        //.tablesorterPager({container: $("#pager")}); 
    }
	function favoritSort(){
		$("#favoritSort")
                .tablesorter({
                    sortList: [[0, 0]],
                    headers: {3: {sorter: false}, 4: {sorter: false}},
                });
	}
    /******************** CATALOG ACTIONS ***************/
    // Аякс каталога
    // Работа с меню каталога
    $(document).on('click', '.openCatalog', function () {

        var a = $(this);
        var id = a.data("id");
		var isGroup = a.data("group");
		if(isGroup){
			$.ajax({
				type: "POST",
				url: catalogUri,
				data: {id: id, TYPE: 'section'},
				success: function (data) {
					if(data!="") {
						a.removeClass("openCatalog").addClass("closeCatalog")
							//.removeClass("opnElements").addClass("closeElements")
							.parent().append(data);

					}
				}
			});
		}
        return false;
    });
    $(document).on('click', '.closeCatalog', function () {
        var a = $(this);
        a.removeClass("closeCatalog").addClass("openCatalog")
            //.removeClass("closeElements").addClass("opnElements")
            .parent().find("ul").remove();

        return false;
    });

    $(document).on('click', '.btmSort', function () {
        var a = $(this);
        var id = $('#catalogKey').html();
        var checked ="N";
        var letter = $(this).data("letter");
        if($('#areVal').prop('checked')) var checked = change;
        else var checked = "N";

        $('#sortKey').html( $(this).data("sort"));
        var sort = $('#sortKey').html();
        var start = $('#startKey').html()
        var amount = $('#amountKey').html();
        var letter = $(this).data("letter");

        var id = $("#catalogKey").html();
        var brand = $("#brandKey").html();
        var change = $("#areVal").val();
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, checked: checked, brand: brand, sort: sort, start: start, amount: amount, letter: letter, TYPE: 'list_sort'},
            beforeSend: function () {
                if(brand != undefined){
                    $(".items-list").empty();
                    $(".items-list").append("<div class='windows8'></div>");
                }
                else{
                    $("body").animate({"scrollTop":0},"slow");
                    $(".ajax-brends").empty();
                    $(".divTable").empty();
                    $(".divTable").append("<div class='windows8'></div>");
                }
            },
            success: function (data) {
                $("#catalogKey").html(id);
                if(brand != undefined){
                    $(".items-list").empty();
                    $(".windows8").css("display", "none");
                    $(".items-list").append(data);
                }
                else{
                    $(".divTable").empty();
                    $(".windows8").css("display", "none");
                    $(".divTable").append(data);
                }
                fn_sort();

            }
        });
        return false;
    });
    //постарничная нафигация
    $(document).on('click', '.pagenavElements', function () {

        if($(this).hasClass('active')){
            return;
        }
        var id = $('#catalogKey').html();
        var brand = $('#brandKey').html();
        var checked ="N";
        $('#startKey').html($(this).data("start"));
        var sort = $('#sortKey').html();
        var start = $(this).data("start");
        var amount = $('#amountKey').html();
        var letter = $(this).data("letter");
        if($('#areVal').prop('checked')) var checked = change;
        else var checked = "N";
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, checked: checked, brand: brand, sort: sort, start: start, amount: amount, letter: letter, TYPE: 'list_sort'},
            beforeSend: function () {
                if(brand != undefined){
                    $(".items-list").empty();
                    $(".items-list").append("<div class='windows8'></div>");
                }
                else{
                    $("body").animate({"scrollTop":0},"slow");
                    $(".ajax-brends").empty();
                    $(".divTable").empty();
                    $(".divTable").append("<div class='windows8'></div>");
                }
            },
            success: function (data) {
                $("#catalogKey").html(id);
                if(brand != undefined){
                    $(".items-list").empty();
                    $(".windows8").css("display", "none");
                    $(".items-list").append(data);
                }
                else{
                    $(".divTable").empty();
                    $(".windows8").css("display", "none");
                    $(".divTable").append(data);
                }
                fn_sort();

            }
        });
        return false;
    });

    // Подгрузка элементов каталога
    $(document).on('click', '.opnElements', function () {
        var a = $(this);
        var id = $(this).data("id");
        $("#brandKey").html($(this).data("brand"));
        $('#startKey').html("0");
        var change = $("#areVal").val();
        var brand = $('#brandKey').html();
        var checked ="N";
        var sort = $('#sortKey').html();
        var start = $('#startKey').html();
        var amount = $('#amountKey').html();
		var letter = $(this).data("letter");
        if($('#areVal').prop('checked')) var checked = change;
        else var checked = "N";
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, checked: checked, brand: brand, sort: sort, start: start, amount: amount, letter: letter, TYPE: 'list_sort'},
            beforeSend: function () {
                if(brand != undefined){
					$(".items-list").empty();
					$(".items-list").append("<div class='windows8'></div>");
				}
				else{
					$("body").animate({"scrollTop":0},"slow");
					$(".ajax-brends").empty();
					$(".divTable").empty();
					$(".divTable").append("<div class='windows8'></div>");
				}
            },
            success: function (data) {
				$("#catalogKey").html(id);
				if(brand != undefined){
					$(".items-list").empty();
					$(".windows8").css("display", "none");
					$(".items-list").append(data);
				}
				else{
					$(".divTable").empty();
					$(".windows8").css("display", "none");
					$(".divTable").append(data);
				}
                fn_sort();

            }
        });
        return false;
    });
    $(document).on('click', '.catalogCheck', function() {
        var id = $("#catalogKey").html();
        var change = $("#areVal").val();
        if($('#areVal').prop('checked')) var checked = change;
        else var checked = "N";
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, checked: checked, TYPE: 'list'},
            beforeSend: function () {
                $("body").animate({"scrollTop":0},"slow");
                $(".divTable").empty();
                $(".divTable").append("<div class='windows8'></div>");
            },
            success: function (data) {
                $(".divTable").empty();
                $(".windows8").css("display", "none");
                $(".divTable").append(data);
                fn_sort();

            }
        });
    });
    // Поиск аналогов
    $(document).on('click', '.openAnalogModal', function() {
        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, TYPE: 'analogs'},
            beforeSend: function() {
                $("#analogModal .modal-body").empty()
                    .append("<div class='windows8'></div>");
            },
            success: function(data) {
                $("#analogModal .modal-body").empty()
                    .append(data);
            }
        });
    });
    //детальная карточка товара
    $(document).on('click', '.detailCard', function () {
        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, TYPE: 'detail'},
            beforeSend: function () {
                $("#detailCard .modal-body").empty()
                        .append("<div class='windows8'></div>");
            },
            success: function (data) {
                $("#detailCard .modal-body").empty()
                        .append(data);
            }
        });

    });
   
    // Поиск
    $(document).on('click', '.serchButton', function () {
        $(".search .alert").remove();
        if ($("#searchInput").val().length >= 5) {
            var req = $(".search-opt").val();
            var a=$(this);
            //var req = "name_code";
            var change = $("#areVal").val();
            if($('#areVal').prop('checked')) var checked = change;
            else var checked = "N";
            var value = $("#searchInput").val();
            $.ajax({
                type: "POST",
                url: catalogUri,
                data: {req: req, value: value, checked: checked, TYPE: 'search'},
                beforeSend: function () {
                    a.attr('disabled','disabled');
					$(".ajax-brends").empty();
                    $(".divTable").empty();
                    $(".divTable").append("<div class='windows8'></div>");
                    //$(".windows8").css("display", "block");
                },
                success: function (data) {
                    $(".divTable").empty();
                    $(".windows8").css("display", "none");
                    $(".divTable").append(data);
                    a.removeAttr('disabled');
                    fn_sort();
                }
            });
        }
        else{
            $('.search').append('<div class="alert alert-danger" role="alert">Строка поиска должна содержать не немее 5 символов</div>')
            //alert("Строка поиска должна содержать не немее 5 символов");
        }
        return false;
    });
    // Избранное
    $(document).on('click', '.favoritKey', function() {
        var a = $(this);
        var id = a.data("id");
        var price = a.data("price");
        var name = a.data("name");
        var art = a.data("art");
        var quantity = a.data("quantity");
        $.ajax({
            type: "POST",
            url: favoritUri,
            data: {id: id, price: price, name: name, art: art, quantity: quantity, TYPE: 'add'},
            beforeSend: function() {
                a.addClass("disabled").removeClass("favoritKey");
            },
            success: function(data) {
                if (data == 0) a.children().removeClass("glyphicon-star").addClass("glyphicon-star-empty");
                else a.children().removeClass("glyphicon-star-empty").addClass("glyphicon-star");

                setTimeout(function() {
                    a.removeClass("disabled").addClass("favoritKey");
                }, 500);

            }
        });
    });
    // Обновление страницы избранного
    $(document).on('click', '.tab-favorits', function() {
        $.ajax({
            type: "POST",
            url: favoritUri,
            data: {TYPE: 'list'},
            beforeSend: function() {
                $("#favorit_table").empty()
                    .append("<div class='windows8'></div>");
            },
            success: function(data) {
                $("#favorit_table").empty()
                    .append(data);
				favoritSort();
            }
        });
    });
    // Удалить из избранного
    $(document).on('click', '.removeFavorit', function() {
        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: favoritUri,
            data: {id: id, TYPE: 'delete'},
            /*beforeSend: function() {
                $("#favorit_table").empty()
                    .append("<div class='windows8'></div>");
            },
            success: function(data) {
                $("#favorit_table").empty()
                    .append(data);
            }*/
			success: function(data) {
				a.parent().parent().remove();
			}
			
        });
    });
    // Закрыть каталог
    $(document).on('click', '.closeCatalog', function () {
        return false;
    });
	//количество товара в разрезе по городам
	$(document).on('click', '.moreByCity', function () {
        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {id: id, TYPE: 'quant'},
            beforeSend: function () {
                $("#detailCity .modal-body").empty()
                        .append("<div class='windows8'></div>");
            },
            success: function (data) {
                $("#detailCity .modal-body").empty()
                        .append(data);
            }
        });

    });
    /******************** END CATALOG ACTIONS ***************/
    /******************** BASKET ACTIONS ***************/
    //Добавление в корзину
    $(document).on('click', '.to-basket', function () {
        var a = $(this);
        var id = a.data("id");
        var quantity = a.parent().parent().find(".cnt-basket[data-id='" + id + "']").val();
        var name = a.data("name");
        var price = a.data("price");
        var art = a.data("art");
        //console.log(quantity, id, name, price);
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {id: id, cnt: quantity, name: name, price: price, art: art, TYPE: 'add'},
            beforeSend: function(){
                a.addClass("disabled").removeClass("to-basket");
            },
            success: function (data) {
                backet_refresh();
                $(".basketTableAjax").html('');
                $(".basketTableAjax").append(data);
                a.addClass("btn-success");
                a.children().removeClass("glyphicon-shopping-cart").addClass("glyphicon-ok");
                sum_refresh();
                hide_button();
                setTimeout(function () {
                        a.removeClass("disabled").removeClass("btn-success").addClass("to-basket");
                        a.children().addClass("glyphicon-shopping-cart").removeClass("glyphicon-ok");
                    },
                    2000
                );
            }
        });


    });
    // Апдейт корзины
    function updateBasket(e) {
        var $this = $(e.target);
        var quantity = $this.val(),
                basketid = $this.data('trid'),
                id = $('#tr' + $this.data('trid') + ' td:eq(0)').children().data("id"),
                art = $('#tr' + $this.data('trid') + ' td:eq(0)').children(".art").html(),
                name = $('#tr' + $this.data('trid') + ' td:eq(0)').children(".detailCard").html(),
                price = parseFloat($('#tr' + $this.data('trid') + ' td:eq(1)').html().replace(/\s+/g, ''));
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {basketid: basketid, id: id, art: art, cnt: quantity, name: name, price: price, TYPE: 'update'},
            success: function (data) {
                newPrice = (parseFloat(quantity) * parseFloat(price)).toFixed(2);
                $('#price-' + basketid).html(number_format(newPrice, 2, '.', ' '));
                fullSumm = $('#full-cart-price').html().replace(/\s+/g, '');
                htmlSumm = data;
                $('#full-cart-price').html(htmlSumm);
                sum_refresh();
            }
        });
    }
    function del_spaces(str)
    {
        str = str.replace(/\s/g, '');
        return str;
    }
    function updateBasket_New(bs_id, id_ar, but) {
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {basketid: bs_id, id: id_ar, TYPE: 'update_new'},
            success: function (data) {
                var new_price = jQuery.parseJSON(data);
                var items = $('.cnt-basket-changer');
                $('#info_bask').empty();
                items.each(function(i,elem) {
                    var id = del_spaces($('#tr' + $(elem).data('trid')).data("id"));
                    var name = $('#tr' + $(elem).data('trid') + ' td:eq(0)').children(".detailCard").html()
                    var price_n;
                    try {
                        price_n = new_price['ProductPrices'][id]['price'];
                    } catch (err) {
                        price_n = 0;
                    }

                    var price = parseFloat($('#tr' + $(elem).data('trid') + ' td:eq(1)').html().replace(/\s+/g, ''));
                    var row_del = $(elem).parents('tr').find('.delBacketItem');
                    var row_up = $(elem).parents('tr').find('.cnt-basket-changer');
                    row_up.click();
                    if(price_n == 0){
                        $(row_del).click();
                        $('#info_bask').append('<br> Из заказа удален <b>'+ name +'</b>. Нет в наличии.');
                        $('#info_bask_p').append('<br> Из заказа удален <b>'+ name +'</b>. Нет в наличии.');
                    }else if(price_n != price){
                        $('#tr' + $(elem).data('trid') + ' td:eq(1)').html(price_n);
                        row_up.click();
                        $('#info_bask').append('<br> Обновлена цена для <b>'+ name +'</b>. Новая цена '+price_n+'р., старая цена '+price+'р.');
                        $('#info_bask_p').append('<br> Обновлена цена для <b>'+ name +'</b>. Новая цена '+price_n+'р., старая цена '+price+'р.');
                    }

                });
                Data = new Date();
                Year = Data.getFullYear();
                Month = Data.getMonth();
                Day = Data.getDate();
                Hour = Data.getHours();
                Minutes = Data.getMinutes();
                Seconds = Data.getSeconds();
                $('#info_bask').append('<br> Обновление цен успешно завершено');
                $('#info_bask_p').html('<br> Время последнего обновления цен в заказе: ' +Year+'-'+Month+'-'+Day+' '+Hour+':'+Minutes+':'+Seconds);
                $('#updOrders').html('0');
                setTimeout(function() { $('#update_bask').modal('hide'); }, 3000)

                //$('#info_bask').hide();
                $('#add_zakaz').removeAttr('disabled');
            }
        });

    }
    $(document).on('click', '.cnt-basket-changer', $.proxy(updateBasket, this));
    $(document).on('keyup', '.cnt-basket-changer', $.proxy(updateBasket, this));
    //Удаление из корзины
    $(document).on('click', '.delBacketItem', function () {

        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {id: id, TYPE: 'delete'},
            success: function (data) {
                a.parent().parent().remove();
                backet_refresh();
                sum_refresh();
                hide_button();
            }
        });

    });

	//количество элементов в корзине
    function backet_refresh() {
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {TYPE: 'refresh'},
            success: function (data) {
                $(".countCol").html(data);
            }
        });
    }
    
    //пересчет суммы
    function sum_refresh() {
        var sum = 0;
        $(".b-sum").each(function () {

            var val = $(this).text().replace(/\s+/g, '');
            val = parseFloat(val);
            sum += val;
        });
        $(".basketItog").text(number_format(sum, 2, '.', ' '));
    }
    

    //Добавление шаблона
    $(document).on('click', '.to-samples', function () {
        var a = $(this);
        var sname = $(".sample-name").val();
        if (sname.length > 1) {
            //console.log(quantity, id, name, price);

            $.ajax({
                type: "POST",
                url: basketUri,
                data: {sname: sname, TYPE: 'samples'},
                beforeSend: function () {
                    a.removeClass("to-samples");
                },
                success: function (data) {
                    //alert(data);
                    //$(".samplesDiv").html(data);
                    if (data == "Error") {
						a.addClass("to-samples");
						$(".sampleWarning").show().html("Шаблон с таким именем уже существует");
					}
                    else {
						$(".sampleWarning").hide();
                        a.addClass("to-samples");
                        a.hide();
                        $(".sample-name").hide();
                        $(".sampleClose").show();
                        $(".samplesSuccess").show().html("Шаблон добавлен!");
                    }
                }
            });
        }
        else alert("Введите название шаблона");
        return false;

    });
    $(document).on('click', '.saveSampleBlock', function () {
        $(".sample-name").val("").show();
        $(".samplesSuccess").hide();
        $(".sampleWarning").hide();
        $(".to-samples").show();
        $(".sampleClose").hide();
    });

    //Отображения шаблонов
    $(document).on('click', '.tab-samples', function () {
        var a = $(this);
       // var sname = $(".sample-name").val();
        //console.log(quantity, id, name, price);
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {TYPE: 'samples_show'},
            beforeSend: function(){
                $(".samplesDiv").empty();
                $(".samplesDiv").append("<div class='windows8'></div>");
            },
            success: function (data) {
                $(".samplesDiv").empty();
                $(".samplesDiv").html(data);
            }
        });


    });
    //Детальная карточка шаблонов
    $(document).on('click', '.detailSampleCard', function () {
        var a = $(this);
        var id = a.data("id");
        var sname = a.data("sname");
        //console.log(quantity, id, name, price);
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {TYPE: 'samples_detail', id: id, sname: sname},
            beforeSend: function () {
                $("#detailSampleCard .modal-body").empty()
                    .append("<div class='windows8'></div>");
            },
            success: function (data) {
                $("#detailSampleCard h4").text("Шаблон "+sname);
                $("#detailSampleCard .modal-body").empty()
                    .append(data);
            }
        });


    });
    //Удаление шаблона
    $(document).on('click', '.delSampleItem', function () {
        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {id: id, TYPE: 'samples_del'},
            success: function (data) {
                a.parent().parent().remove();
            }
        });

    });

    //Повторить заказ из шаблона
    $(document).on('click', '.sampleRepeat', function () {
        var a = $(this);
        var id = a.data("id");
        $.ajax({
            type: "POST",
            url: basketUri,
            data: {id: id, TYPE: 'sampel_repeate'},
            beforeSend: function () {
                a.append("<div class='loaderSmall'></div>");
                a.addClass("disabled").removeClass("sampleRepeat");
            },
            success: function (data) {
                backet_refresh();
                $(".basketTableAjax").html('');
                $(".basketTableAjax").append(data);
                sum_refresh();
                hide_button();
                $('#detailSampleCard').modal('hide');
                a.removeClass("disabled").addClass("sampleRepeat");
            }
        });

    });

    /******************** END BASKET ACTIONS ***************/

    /******************** ORDER ACTIONS ***************/
    //список заказов
    $(document).on('click', '.zakazList', function () {
        var a=$(this);
        var dfrom = $("#zakazDateFrom input").val();
        var dto = $("#zakazDateTo input").val();
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {dfrom: dfrom, dto: dto, TYPE: 'list'},
            beforeSend: function () {
                a.attr('disabled','disabled');
                $(".zakListRes").empty();
                $(".zakListRes").append("<div class='windows8'></div>");
            },
            success: function (data) {
                $(".zakListRes").empty();
                $(".zakListRes").append(data);
                a.removeAttr('disabled');
            }
        });

    });
    //при клике на вкладку Заказы - загрузить список заказов
    $(document).on('click','.tab-orders', function(){
        var a=$(this);
        var dfrom = $("#zakazDateFrom input").val();
        var dto = $("#zakazDateTo input").val();
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {dfrom: dfrom, dto: dto, TYPE: 'list'},
            beforeSend: function () {
                a.removeClass("tab-orders");
                $(".zakListRes").empty();
                $(".zakListRes").append("<div class='windows8'></div>");
            },
            success: function (data) {
                $(".zakListRes").empty();
                $(".zakListRes").append(data);
                a.addClass("tab-orders");
            }
        });
    });
    //детальная карточка заказа
    $(document).on('click', '.showDetailZakaz', function () {
        var a = $(this);
        var number = a.data("num");
        var date = a.data("date");
        var guid = a.data("guid");
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {number: number, date: date, guid: guid, TYPE: 'detail'},
            beforeSend: function () {
                $(".zakazNum").text(number);
                $("#zakazInfo .zakazInfo__inner").empty()
                        .append("<div class='windows8'></div>");
            },
            success: function (data) {
                $(".zakazNum").text(number);
                $("#zakazInfo .zakazInfo__inner").empty()
                        .append(data);
            }
        });

    });
    // Добавить шаблон из заказа
    $(document).on('click', '.to-samples-by-order', function () {
        var a = $(this);
        var sname = $(".sample-name-by-order").val();
        var number = a.data("number");
        var date = a.data("date");
        if (sname.length > 1) {
            //console.log(quantity, id, name, price);

            $.ajax({
                type: "POST",
                url: orderUri,
                data: {sname: sname, number: number, date: date, TYPE: 'samples'},
                beforeSend: function () {
                    a.removeClass("to-samples-by-order");
                },
                success: function (data) {
                    //alert(data);
                    //$(".samplesDiv").html(data);
                    if (data == "Error") {
                        a.addClass("to-samples-by-order");
                        $(".sampleWarningOrder").show().html("Шаблон с таким именем уже существует");
                    }
                    else {
                        $(".sampleWarningOrder").hide();
                        a.addClass("to-samples-by-order");
                        a.hide();
                        $(".sample-name-by-order").hide();
                        $(".sampleCloseOrder").show();
                        $(".samplesSuccessOrder").show().html("Шаблон добавлен!");
                    }
                }
            });
        }
        else alert("Введите название шаблона");
        return false;

    });
    $(document).on('click', '.saveSampleBlockByOrder', function () {
        $(".sample-name-by-order").val("").show();
        $(".samplesSuccessOrder").hide();
        $(".sampleWarningOrder").hide();
        $(".to-samples-by-order").show();
        $(".sampleCloseOrder").hide();
    });
    //печать заказа
    $(document).on('click', '.zakazPrint', function () {
        var a = $(this);
        var number = a.data("number");
        var date = a.data("date");
        var frm = a.data("form");
        var win = window.open("/load.html");
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {number: number, date: date, frm: frm, TYPE: 'orderPrint'},
            beforeSend: function () {
                a.append("<div class='loaderSmall'></div>");
                a.addClass("disabled").removeClass("zakazPrint");
            },
            success: function (data) {
                a.find(".loaderSmall").remove();
                //$(".printLink").empty;
                //$(".printLink").append(data);
                a.removeClass("disabled").addClass("zakazPrint");
                //window.open(data);
                win.document.location = data;
            }
        });

    });
    //оформление заказа
    $(document).on('click', '.checkout', function () {
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {TYPE: 'chek_date'},
            beforeSend: function () {
            },
            success: function (data) {
                var new_date = jQuery.parseJSON(data);
                $('#info_bask_p').html('<br> Время последнего обновления цен в заказе: ' + new_date['date']);
                console.log(new_date['res']);
                if(new_date['res']>0){
                    $('#updOrders').html('1');
                    $('#info_bask').html('Цены в Текущем заказе могут бы не актуальными. Обновите цены в заказе по кнопке "Обновить цены в заказе".');
                    //$('#btn_bask').show();
                    $('#info_bask').show();
                    $('#update_bask').modal('show');
                    //$('#add_zakaz').attr('disabled', 'true');
                    return 1;
                }else{
                    $('#updOrders').html('0');
                    $('#info_bask').empty();
                    $('#info_bask').html('Цены актуальны оформляем заказ.');
                    var a = $(this);
                    var shipType = $(".deliveryRadioOne:checked").val();
                    var shipAddress=$("#shipAddress").val();
                    var shipmentCompany=$("#shipmentCompany").val();
                    var comment=$("#commentOrder").val();
                    var desDate = $(".order-desdate").val();
                    var refresh = a.data("edit");
                    var orderNum = a.data("onum");
                    var orderDate = a.data("odate");
                    var orderGUID = a.data("guid");
                    //a.addClass("disabled").removeClass("checkout");
                    $.ajax({
                        type: "POST",
                        url: orderUri,
                        data: {TYPE: 'add', shipType: shipType, shipAddress: shipAddress, shipmentCompany: shipmentCompany, comment: comment, desDate: desDate, refresh: refresh, orderNum: orderNum, orderDate: orderDate, orderGUID: orderGUID},
                        beforeSend: function () {
                            //$(".backetDiv").empty();
                            $(".backetDiv").append("<div class='windows8'></div>");
                            var bHeight = $(".backetDiv").height();
                            var bWidth = $(".backetDiv").width();
                            $(".blackBack").show();
                            $(".blackBack").height(bHeight);
                            $(".blackBack").width(bWidth);
                            a.hide();
                        },
                        success: function (data) {
                            $(".windows8").remove();
                            $(".orderStatus").text("").append(data);
                            if(data=="Документ оформлен!"){
                                $(".tableBasket tr").slice(1).remove();
                                $("#shipAddress").val("");
                                $("#commentOrder").val("");
                                $(".blackBack").hide();
                                $("#basket h1").html("Текущий заказ");

                                backet_refresh();
                                sum_refresh();
                                hide_button();
                                a.data("edit","")
                                    .data("onum","")
                                    .data("odate","")
                                    .data("guid","");

                            }
                            else{
                                $(".blackBack").hide();

                            }
                            a.show();

                        }
                    });
                    return 0;
                    //$('#btn_bask').hide();
                    //$('#info_bask').hide();
                    // $('#add_zakaz').removeAttr('disabled');
                }

            }
        });

    });

    //проверить-обновить цены в заказе
    $(document).on('click', '.update_order', function () {
        var _this = this;
        var items =$('.cnt-basket-changer');
        var bask_id = '';
        var id_arr = new Array();
        items.each(function(i,elem) {
            console.log(elem);
            var id = $('#tr' + $(elem).data('trid')).data("id");
            id_arr.push(id);
        });
        console.log(id_arr);
        updateBasket_New(bask_id, id_arr, _this);
    });

    //Повторить заказ
    $(document).on('click', '.zakazRepeat', function () {
        var a = $(this);
        var number = a.data("number");
        var date = a.data("date");
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {number: number, date: date, TYPE: 'repeate'},
            beforeSend: function () {
                a.append("<div class='loaderSmall'></div>");
                a.addClass("disabled").removeClass("zakazRepeat");
            },
            success: function (data) {
                backet_refresh();
                $(".basketTableAjax").html('');
                $(".basketTableAjax").append(data);
                sum_refresh();
                hide_button();
                $('#zakazInfo').modal('hide');
                a.removeClass("disabled").addClass("zakazRepeat");
            }
        });

    });
    //скрыть кнопки и прочее если пустая корзина
    function hide_button() {
        if ($(".tableBasket tr").length <= 1) {
            $(".backetDiv").hide();
            $(".emptyBasket").show().text("Добавьте товар для формирования заказа.");
        }
        else {
            $(".backetDiv").show();
            $(".emptyBasket").hide().text("");
        }
    }
    ;
    $(".backetLink").click(function () {
        $(".orderStatus").empty();
        chek_date();
    });


    function chek_date(){
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {TYPE: 'chek_date'},
            beforeSend: function () {
            },
            success: function (data) {
                var new_date = jQuery.parseJSON(data);
                $('#info_bask_p').html('<br> Время последнего обновления цен в заказе: ' + new_date['date']);
                console.log(new_date['res']);
                if(new_date['res']>0){
                    $('#updOrders').html('1');
                    $('#info_bask').html('Цены в Текущем заказе могут бы не актуальными. Обновите цены в заказе по кнопке "Обновить цены в заказе".');
                    //$('#btn_bask').show();
                    $('#info_bask').show();
                    //$('#add_zakaz').attr('disabled', 'true');
                    return 1;
                }else{
                    $('#updOrders').html('0');
                    $('#info_bask').empty();
                    $('#info_bask').html('Цены актуальны оформляем заказ.');
                    return 0;
                    //$('#btn_bask').hide();
                    //$('#info_bask').hide();
                   // $('#add_zakaz').removeAttr('disabled');
                }

            }
        });

    }
    /******************** END ORDER ACTIONS ***************/
    
    /******************** PAYMENT ACTIONS ***************/
    //список документов
    $(document).on('click', '.paymentsList', function () {
        var a=$(this);
        var dfrom = $(this).parent().parent().find("#paymentsDateFrom input").val();
        var dto = $(this).parent().parent().find("#paymentsDateTo input").val();
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {dfrom: dfrom, dto: dto, TYPE: 'paymentList'},
            beforeSend: function () {
                a.attr('disabled','disabled');
                $(".paymentsListRes").empty();
                $(".paymentsListRes").append("<div class='windows8'></div>");
            },
            success: function (data) {
                $(".paymentsListRes").empty();
                $(".paymentsListRes").append(data);
                a.removeAttr('disabled');
            }
        });

    });
    //детальная инфа по взаиморасчетам
    $(document).on('click', '.paymentsInfo', function () {
        var a = $(this);
        var name = a.data("name");
        var guid = a.data("guid");
        var title = a.text();
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {name: name, guid: guid, TYPE: 'detailPayment'},
            beforeSend: function () {
                $("#orders").removeClass("active");
                $("#payments").addClass("active");
                $("#paymentsInfoLabel").text(title);
                $("#paymentsInfo .modal-body").empty()
                        .append("<div class='windows8'></div>");
            },
            success: function (data) {
                $("#paymentsInfoLabel").text(title);
                $("#paymentsInfo .modal-body").empty()
                        .append(data);
            }
        });

    });
    $(document).on('click', '.closeDoc', function() {
        if ($("#zakazInfo").hasClass("in")) {
            $("#payments").removeClass("active");
            $("#orders").addClass("active");
            
            setTimeout(function() {
                document.body.classList.add('modal-open');
            }, 1000);

        }
    });
    //печать взаиморасчеты
    $(document).on('click', '.paymentsPrint', function () {
        var a = $(this);
        var name = a.data("name");
        var guid = a.data("guid");
        var type = a.data("type");
        var win = window.open("/load.html");
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {name: name, guid: guid, type: type, TYPE: 'docPrint'},
            beforeSend: function () {
                a.append("<div class='loaderSmall'></div>");
                a.addClass("disabled").removeClass("paymentsPrint");
            },
            success: function (data) {
                a.find(".loaderSmall").remove();
                a.removeClass("disabled").addClass("paymentsPrint");
                //window.open(data);
                win.document.location = data;
            }
        });

    });
    /******************** END PAYMENT ACTIONS ***************/
    /******************** USER ACTIONS ***************/
    $(document).on('click', '.btnInfo', function () {
        $(".infoMess").hide();
        //$(".changeErrorMess").hide();
    });
    $(document).on('click', '.changeContactInfo', function () {
        var a = $(this);
        var email = $("#changeContactEmail").val();
        var phone = $("#changeContactPhone").val();
        var access = {status: true, text: ''};
        if (!/[a-z0-9_-]+(\.[a-z0-9_-]+)*@([0-9a-z][0-9a-z-]*[0-9a-z]\.)+([a-z]{2,4})/i.test(email)) access = {status: false, text: 'В поле не E-mail'};
        if (!/^\d[\d\(\)\ -]{4,14}\d$/i.test(phone)) access = {status: false, text: 'Номер телефона указан некорректно'};
        if (access.status == true) {
            $.ajax({
                type: "POST",
                url: userUri,
                data: {email: email, phone: phone, TYPE: 'update'},
                beforeSend: function () {
                    $(".changeErrorMess.infoMess").hide();
                    a.append("<div class='loaderSmall'></div>");
                    a.addClass("disabled").removeClass("changeContactInfo");
                },
                success: function (data) {
                    a.find(".loaderSmall").remove();
                    a.removeClass("disabled").addClass("changeContactInfo");
                    //window.open(data);
                    $(".changeOkMess.infoMess").show().html(data);
                }
            });
        }
        else $(".changeErrorMess.infoMess").show().html(access.text);

    });

    $(document).on('click', '.changeContactNoticeSave', function() {
        var email = "N"; var phone = "N";
        if ($("#changeContactNoticeEmail").prop('checked')) email = "Y";
        if ($("#changeContactNoticePhone").prop('checked')) phone = "Y";
        $.ajax({
            type: "POST",
            url: userUri,
            data: {email: email, phone: phone, TYPE: 'notice'},
            beforeSend: function() {
                $(".notice-alert").hide();
            },
            success: function(data) {
                $(".notice-alert").show();
                setTimeout(function() {
                    $(".notice-alert").hide();
                }, 2000);
            }
        });
    });

    $(document).on('click', '.changeContactPass', function () {
        var a = $(this);
        var pass = $("#changePass").val();
        if ((pass.length > 3)) {
            $.ajax({
                type: "POST",
                url: userUri,
                data: {pass: pass, TYPE: 'changePass'},
                beforeSend: function () {
                    a.append("<div class='loaderSmall'></div>");
                    a.addClass("disabled").removeClass("changeContactPass");
                },
                success: function (data) {
                    a.find(".loaderSmall").remove();
                    a.removeClass("disabled").addClass("changeContactPass");
                    //window.open(data);
                    $(".passOkMess.infoMess").show().html(data);
                }
            });
        }
        else $(".passErrorMess.infoMess").show().html("Пароль должен быть более 3 символов. Изменения не будут сохранены.");

    });

    // Отправка письма в тех. поддержку.
    $(document).on('click', '.send-support-mail', function() {

        function checkForm(name, mail, text) {
            var check = false;
            if (name.length < 2 || name.length > 15 || name == 'Имя') check = "Неверная длина имени";
            else
                if (text.length < 6) check = "Минимальная длина отправляемого сообщения 6 смиволов";
            if (mail == "") check = "Заполните поле E-mail или телефон";
            return check
        }

        var name = $("#suppName").val();
        var mail = $("#suppMail").val();
        var text = $("#suppText").val();

        var check = checkForm(name, mail, text);
        if (check == false) {
            $.ajax({
                type: "POST",
                url: userUri,
                data: {name: name, mail: mail, text: text, TYPE: 'supportMail'},
                beforeSend: function() {
                    $(".send-support-mail").hide();
                },
                success: function(data) {
                    $(".support-form-danger").removeClass("alert-danger").addClass("alert-success");
                    $(".support-form-danger").show().html("Сообщение отправлено");
                    $(".supportForm-forma").hide();
                }
            });
        } else {
            $(".support-form-danger").show().html(check);
        }


    });
    $(document).on('click','.support_button', function() {
        $(".support-form-danger").removeClass("alert-success").addClass("alert-danger");
        $(".support-form-danger").hide();
        $("#suppName").val("");
        $("#suppMail").val("");
        $("#suppText").val("");
        $(".supportForm-forma").show();
        $(".send-support-mail").show();
    });

    $(document).on('click', '.statList', function() {

        var dfrom = $("#zakazDateFrom input").val();
        var dto = $("#zakazDateTo input").val();

        $.ajax({
            type: "POST",
            url: userUri,
            data: {dfrom: dfrom, dto: dto, TYPE: "statList"},
            beforeSend: function() {
                $("#stat_index_wrap").empty()
                        .append("<div class='windows8'></div>");
            },
            success: function(data) {
                $("#stat_index_wrap").empty()
                        .append(data);
            }
        });
    
    });

    /******************** END USER ACTIONS ***************/

    //14.06.2017
	// Поиск по группам
	$(document).on('submit', '.ajax-search-group', function () {
		if ($("#search-brend").val().length > 2) {
			var value = $("#search-brend").val();
			$.ajax({
				type: "POST",
				url: catalogUri,
				data: {value: value, TYPE: 'searchBrend'},
				beforeSend: function () {
					$(".catalogMenu").empty();
				},
				success: function (data) {
					$(".catalogMenu").append(data);
				}
			});

		}
		return false;
	});
	// Сброс поиска по группам
	$(document).on('click', '.ajax-reset-brend', function () {
		var a = $(this);
		$("#search-brend").val("");
		$.ajax({
			type: "POST",
			url: catalogUri,
			data: {value: "", TYPE: 'searchBrend'},
			beforeSend: function () {
				a.attr('disabled','disabled');
				$(".catalogMenu").empty();
			},
			success: function (data) {
				$(".catalogMenu").append(data);
				a.removeAttr('disabled');
			}
		});
		return false;
	});
	//все бренды
	$(document).on('click', '.ajax-all-brands', function(){
		var a = $(this);
		$.ajax({
			type: "POST",
			url: catalogUri,
			data: {id: "", TYPE: 'allBrends'},
			beforeSend: function () {
				$(".ajax-brends").empty();
				$(".divTable").empty();
				$(".divTable").append("<div class='windows8'></div>");
				a.css("pointer-events","none");

			},
			success: function (data) {
				$(".windows8").css("display", "none");
				$(".divTable").empty();
				$(".ajax-brends").append(data);
				a.css("pointer-events","auto");
			}
		});
	});
    $(document).on('click', '.ajax-brend-beta', function(e){
        var a = $(this);
        var isGroup = a.data("group");
        if(!isGroup){
            var letter = a.data("letter");
            var id = a.data("id");
            $.ajax({
                type: "POST",
                url: catalogUri,
                data: {letter: letter, id: id, TYPE: 'allBrends', allbrend: 'no'},
                beforeSend: function () {
                    if(id){
                        e.preventDefault();
                        $('html, body').animate({scrollTop: 0}, "slow");
                    }
                    if($(a).hasClass("opnBrends")) $(".ajax-brends").empty();
                    $(".divTable").empty();
                    $(".divTable").append("<div class='windows8'></div>");
                },
                success: function (data) {
                    $(".windows8").css("display", "none");
                    $(".divTable").empty();
                    $(".divTable").append(data);
                    var brand = "";
                    var checked ="N";

                }
            });

        }
    });

    //список брендов
	$(document).on('click', '.ajax-brend-alph', function(e){
		var a = $(this);
		var isGroup = a.data("group");
		if(!isGroup){
			var letter = a.data("letter");
			var id = a.data("id");
			$.ajax({
				type: "POST",
				url: catalogUri,
				data: {letter: letter, id: id, TYPE: 'allBrends'},
				beforeSend: function () {
					if(id){
						e.preventDefault();
						$('html, body').animate({scrollTop: 0}, "slow");
					}
					if($(a).hasClass("opnBrends")) $(".ajax-brends").empty();
					$(".divTable").empty();
					$(".divTable").append("<div class='windows8'></div>");
				},
				success: function (data) {
					$(".windows8").css("display", "none");
					$(".divTable").empty();
					$(".divTable").append(data);
                    var brand = $('#brandKey').html();
                    var checked ="N";
                    var sort = $('#sortKey').html();
                    $('#startKey').html("0");
                    var start = $('#startKey').html();
                    var amount = $('#amountKey').html();
                    $.ajax({
                        type: "POST",
                        url: catalogUri,
                        data: {id: id, checked: checked, brand: brand, sort: sort, start: start, amount: amount, letter: letter, TYPE: 'list_sort'},
                        beforeSend: function () {
                            if(brand != undefined){
                                $(".items-list").empty();
                                $(".items-list").append("<div class='windows8'></div>");
                            }
                            else{
                                $("body").animate({"scrollTop":0},"slow");
                                $(".ajax-brends").empty();
                                $(".divTable").empty();
                                $(".divTable").append("<div class='windows8'></div>");
                            }
                        },
                        success: function (data) {
                            $("#catalogKey").html(id);
                            if(brand != undefined){
                                $(".items-list").empty();
                                $(".windows8").css("display", "none");
                                $(".items-list").append(data);
                            }
                            else{
                                $(".divTable").empty();
                                $(".windows8").css("display", "none");
                                $(".divTable").append(data);
                            }
                            fn_sort();

                        }
                    });
				}
			});

		}
	});

	//02.09.2017
    $(document).on('click', '.modal .modal-close', function () {
        $(this).closest('.modal').modal('hide');
    });

	//редактирование заказа
    $(document).on('click', '.ajax-order-edit', function(){
        var a = $(this);
        var number = a.data("number");
        var date = a.data("date");
		var guid = a.data("guid");
        $.ajax({
            type: "POST",
            url: orderUri,
            data: {number: number, date: date, guid: guid, TYPE: 'edit'},
            beforeSend: function () {
                a.append("<div class='loaderSmall'></div>");
                a.addClass("disabled").removeClass("ajax-order-edit");
            },
            success: function (data) {
                backet_refresh();
                $("#basket").html('')
					.append(data);
                $('.modal').modal('hide');
                $('a[href="#basket"]').tab('show');
                a.removeClass("disabled").addClass("ajax-order-edit");
				$('.selectDate').datetimepicker(
					{pickTime: false, language: 'ru'}
				);
            }
        });
    });

    $(document).on('click', '.js-price', function(){
        var a = $(this);
        var win = window.open("/load.html");
        $.ajax({
            type: "POST",
            url: catalogUri,
            data: {TYPE: 'price'},
            beforeSend: function () {
                a.append("<div class='loaderSmall'></div>");
                a.addClass("disabled").removeClass("js-price");
            },
            success: function (data) {
                a.find(".loaderSmall").remove();
                a.removeClass("disabled").addClass("js-price");
                var link = '<div style="padding-top: 40px; text-align: center; font-size: 20px;"><a href='+data+'>Скачать прайс-лист</a></div>';
                $(".load", win.document).remove();
                $("body", win.document).append(link);
            }
        });
    });
});