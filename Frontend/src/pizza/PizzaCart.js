/*
 * Created by chaika on 02.02.16.
 */
var Storage = require("../Storage/StorageManager");
var Templates = require('../Templates');
//Перелік розмірів піци
var PizzaSize = {
    Big: ["big_size", "велика"],
    Small: ["small_size", "мала"]
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart =[];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $total = $(".total");
var $amount = $(".amount");

function addToCart(pizza, size) {
    var alreadyInCart = -1;
    Cart.forEach(function (cart_item) {
        if (cart_item.pizza.id === pizza.id && cart_item.size[0] === size[0]) {
            alreadyInCart = Cart.indexOf(cart_item);
    }
    });
    if (alreadyInCart !== -1) {
        Cart[alreadyInCart].quantity++;
    }
    else
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });

    updateCart();
}

function removeFromCart(cart_item) {
    var ind = Cart.indexOf(cart_item);
    Cart = Cart.slice(0, ind).concat(Cart.slice(ind + 1));
}

function initialiseCart() {
    var repyashoque = Storage.get('cart');
    if (repyashoque)
        Cart = repyashoque;
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function getTotalPrice() {
    var sum = 0;
    Cart.forEach(function (cart_item) {
        sum += cart_item.pizza[cart_item.size[0]].price * cart_item.quantity;
    });
    return sum;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");
    var edit = $(".btn-order").text();
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = edit ?  Templates.PizzaCart_OneItem(cart_item) : Templates.PizzaCart_OneItem_Order(cart_item);
        var $node = $(html_code);
        $node.find(".btn-success").click(function () {
            cart_item.quantity += 1;
            updateCart();
        });

        $node.find(".btn-danger").click(function () {
            cart_item.quantity--;
            if (cart_item.quantity == 0) {
                removeFromCart(cart_item);
            }
            updateCart();
        });

        $node.find(".btn-default").click(function () {
            removeFromCart(cart_item);
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    $total.text(getTotalPrice()+ " грн");
    $amount.text(Cart.length);
    Storage.set('cart', Cart);
    var orderButton = $(".btn-order");
    if(!Cart.length) {
        orderButton.prop("disabled", true);
        orderButton.removeAttr("onclick");
    }
    else {
        orderButton.attr("onclick", "window.location.href='/order.html'");
        orderButton.prop("disabled", false);
    }
}

$(".btn-link").click(function () {
    Cart = [];
    updateCart();
});

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.totalPrice = getTotalPrice;