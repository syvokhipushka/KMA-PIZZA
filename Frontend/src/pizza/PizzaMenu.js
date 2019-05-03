/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
var Pizza_List = {};

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var filters = {

    0: function (pizza) {
        return true;
    },
    1: function (pizza) {
        return pizza.type === 'М’ясна піца'
    },
    2: function (pizza) {
        return pizza.content.pineapple;
    },
    3: function (pizza) {
        return pizza.content.mushroom;
    },
    4: function (pizza) {
        return pizza.content.ocean;
    },
    5: function (pizza) {
        return pizza.type === 'Вега піца'
    }

};
var titles = {

    0: "Усі піци",
    1: "Мʼясні піци",
    2: "Піци з ананасами",
    3: "Піци з грибами",
    4: "Піци з морепродуктами",
    5: "Вегетаріанські піци"

};
function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    var pizza_shown = [];
    var title = titles[filter];
    var filterFunc = filters[filter];
    var count = 0;
    Pizza_List.forEach(function (pizza) {
        if (filterFunc(pizza)) {
            count++;
            pizza_shown.push(pizza);
        }
    });
    $(".page-title").html("<h1>" + title +"\n" +
        "            <span class=\"count\">"+ count + "</span>\n" +
        "        </h1>");


    showPizzaList(pizza_shown);
}

$(".nav-link").click(function () {
    var link = $(this);
    $(".nav-link").removeClass("active");
    link.addClass("active");
    link.blur();
    var filter = link.attr("itemid");
    filterPizza(filter);
});

function initialiseMenu() {
    API.getPizzaList(function (err, data) {
        if(err)
            alert('error');
        else {
            Pizza_List = data;
            showPizzaList(Pizza_List);
        }
    });

}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;