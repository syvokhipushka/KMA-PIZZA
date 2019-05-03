/**
 * Created by chaika on 09.02.16.
 */

function	base64(str)	{
    return	new	Buffer(str).toString('base64');
}

var crypto	=	require('crypto');

function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}

var PRIVATE_KEY = "zRNQlIaQIK9tyw325LIZU49P131usWTqoDNhWUOv";
var LIQPAY_PUBLIC_KEY = 'i82130570212';
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var description = "Замовлення піци: " +  order_info.recipient + "\n";
    description += "Адреса доставки: " + order_info.address + "\n";
    description += "Номер телефону: " + order_info.phone + "\n";
    description += "Замлвлення: " + "\n";
    order_info.order.forEach(function (t) {
       description += t[0] + " (" + t[1] + ") " + t[2] + " шт. " + "\n";
    });
    var order	=	{
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	order_info.total_price,
        currency:	"UAH",
        description:	description,
        order_id:	Math.random(),
        sandbox:	1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(PRIVATE_KEY + data + PRIVATE_KEY);
    res.send({
        success: true,
        data: data,
        signature: signature
    });
};