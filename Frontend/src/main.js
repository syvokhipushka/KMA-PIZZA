/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    var PizzaOrder = require('./pizza/PizzaOrder');

    if(window.location.href.indexOf("/order.html")!==-1) {
        PizzaOrder.initializeValidation();
        PizzaOrder.initSubmit();
        PizzaOrder.showMap();
    }
});