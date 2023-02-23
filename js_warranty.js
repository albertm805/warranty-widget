(function ($) {
  var warryManager = {
    init: function () {
      var main_page = this;
      main_page._WarryCustom();
    },

    _WarryCustom: function () {
      // Obtenemos ID de producto
      vtexjs.catalog.getCurrentProductWithVariations().done(function (product) {
        const productId = product.skus[0].sku;
        const idproductcart = product.skus[0].cacheVersionUsedToCallCheckout;
        const bestprice = product.skus[0].bestPrice;

        $.get(
          "/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + productId + "",
          function (data) {

            if (data.Services.length !== 0) {

            $("body").on("click", 'a[href="#"],a[href=""]', function (e) {
              const warrantySelected = $( ".warranty .warry-togle-nav .item-warry-shelf input[type=radio]");
              if (warrantySelected.checked == true) {
                e.preventDefault();
              } else {
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }
              });
              // Obtenemos la garantias de servicio atraves de la api
              const Offerings = data.Services;
              console.log(Offerings);
              console.log(productId, idproductcart, bestprice);

              //  Pintamos HTML servicio garantias
              function add_items_offerings() {
                $(".warranty .skuService").before(
                  "" +
                    '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"/>' +
                    '<div class="loading-screen" id="loadingScreen"><div class="loader">Loading...</div></div>' +
                    '<div class="box-warry">' +
                    '<div class="warry-togle">' +
                    "<img src='https://lapolar.sbins.dev.perk.cl/embed.png'/>" +
                    "<strong>Extiende la garantía de tu producto </strong>" +
                    "</div>" +
                    '<div class="warry-togle-nav">' +
                    '<div id="warry"></div>' +
                    "</div>" +
                    '<div class="popup-garantia">' +
                    '<a href="#popups-tabs" class="open-warranty-modal">' +
                    '<svg class="svgInfo dib" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path fill="#443991" d="M8.188 4.833H9.86V6.5h-1.67V4.833zm0 3.334H9.86v5h-1.67v-5zm.836-7.5C4.413.667.67 4.4.67 9s3.742 8.333 8.353 8.333c4.61 0 8.353-3.733 8.353-8.333S13.634.667 9.024.667zm0 15C5.34 15.667 2.34 12.675 2.34 9s3-6.667 6.683-6.667S15.706 5.325 15.706 9s-2.999 6.667-6.682 6.667z"></path></svg>' +
                    "<span>¿Cómo funciona la garantía?</span>" +
                    "</a>" +
                    "</div>" +
                    "</div>" +
                    '<div class="hide hidden">' +
                    '<div id="popups-tabs" class="popup">' +
                    '<div class="dark-gray"><p>El Servicio de Extensión de Garantía protege frente a fallas mecánicas y electrónicas del artículo adquirido y ampara las reparaciones que sean necesarias, durante la vigencia contratada.</p><p>La vigencia del Servicio de Extensión de Garantía comienza al expirar la garantía original del fabricante y no se extiende a desperfectos o fallas excluidas por la garantía original del producto.</p><div style="background-color: rgb(237, 244, 250); border-radius: 4px; border-width: 0px 0px 0px 4px; border-style: solid; border-color: rgb(54, 141, 247); border-image: initial; box-sizing: border-box; padding: 12px 16px;"><p>Los beneficios otorgados por el servicio de Extensión de Garantía son:</p><ul><li>Llamada gratuita a la línea 800 200 311.</li><li>Reparación del producto fallado durante la vigencia del Servicio de Extensión de Garantía, incluyendo repuestos y mano de obra. Los productos deberán ser ingresados por el cliente al servicio técnico asignado al momento del llamado para notificar la falla.</li><li>Ampara fallas ocasionadas por variaciones de voltaje.</li></ul></div><div style="background-color: rgb(237, 244, 250); border-radius: 4px; border-width: 0px 0px 0px 4px; border-style: solid; border-color: rgb(54, 141, 247); border-image: initial; box-sizing: border-box; padding: 12px 16px; margin-top: 8px;"><p>En cuanto al programa de reemplazo:</p><ul><li>Aplica para todo producto cuyo valor sea inferior a $60.000.</li><li>Incluye un cambio de producto ante una falla que impida el correcto funcionamiento.</li><li>El producto será revisado por el servicio de Extensión de Garantía antes de ser aprobado su reemplazo.</li><li>El nuevo producto podrá ser de menor valor al producto original indicado en la boleta de compra, siempre y cuando el producto nuevo cumpla con las características principales del producto original y el valor máximo a pagar será el registrado en la boleta sin incluir el valor del Servicio de Extensión de Garantía ni gastos por financiamiento.</li></ul></div></div>' +
                    "</div>" +
                    "</div>" +
                    ""
                );

                setTimeout(() => {
                  $( ".warranty .warry-togle-nav .item-warry-shelf input[type=radio]").click(function () {
                    const valueservice = $(this).val();
                    console.log(valueservice);

                    $("body").on("click", ".product__buy a.buy-in-page-button", function (e) {
                      e.preventDefault();
                      const that = $(this);
                      const skuId = skuJson.skus[0].sku;
                      if (skuId != "") {
                        $.ajax({
                          url:
                            "/checkout/cart/add?sku=" +
                            skuId +
                            "&qty=1&seller=1&sc=1&service=" +
                            valueservice +
                            "&sc=1&price=" +
                            bestprice +
                            "&cv=" +
                            idproductcart +
                            "&sc=1",
                          type: "get",
                          success: function (data) {
                            vtexjs.checkout
                              .getOrderForm()
                              .done(function (orderForm) {
                                that.addClass("disabled");
                                window.location.reload();
                                return false;
                              });
                          },
                        });
                      }
                    });
                  });
                }, 10);

                // Pintamos shelf de garantias
                let warry = document.querySelector("#warry");
                warry.innerHTML = "";

                for (let item of Offerings) {
                  warry.innerHTML += `<div class="item-warry-shelf"><p><input type="radio" id="${item.Options[0].Id}" name="fav_language" value="${item.Options[0].Id}"><label for="${item.Options[0].Id}">${item.Name}</label></p> <strong>$${item.Options[0].Price}</strong><a href="/checkout/cart/add?sku=${productId}&qty=1&seller=1&service=${item.Options[0].Id}&sc=1&price=${bestprice}&cv=${idproductcart}&sc=1" rel="${item.Options[0].Id}" data-qty="1"><img src="/arquivos/assets-checkout.png"/></a></div>`;
                }
              }
              add_items_offerings();
            // Dropdown
            $(".warranty .box-warry strong").click(function () {
              $(this).hasClass("active")
                ? ($(this).removeClass("active"), $("#warry").slideUp())
                : ($(this).addClass("active"),
                  $("#warry").slideDown(),
                  $("#warry").css({
                    height: "80px",
                  }));
            });

            // Editar texto garantias
            $(".warranty .warry-togle-nav .item-warry-shelf").each(function () {
              var text = $(this).html();
              $(this).html(
                text.replace("Extiende la garantía de tu producto -", "")
              );
            });
            }
          }
        );

        const money = 45;
        const currency = function (number) {
          return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
          }).format(number);
        };
        console.log(currency(money));
      });
    },
  };

  $(document).ready(function () {
    warryManager.init();
  });

  $(window).on("load", function () {
    $("#loadingScreen").fadeOut(300);
  });

  $("body").on("click", "a.open-warranty-modal", function (e) {
    e.preventDefault();
    var viewqv = $(this).attr("href");
    $.colorbox({
      inline: !0,
      maxWidth: "90%",
      maxHeight: "90%",
      opacity: 0.75,
      width: "760",
      height: "530",
      href: viewqv,
    });
  });
})(jQuery);
