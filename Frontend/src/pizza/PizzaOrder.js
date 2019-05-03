var name, phone, address, MAP, mark, route;

function validateName() {
    name = $("#input_name").val();
    if (name.match(/^([a-zA-Zа-яА-Я]+|[ ]|[\-])+$/)) {
        $(".name").removeClass("has-danger");
        $(".name").addClass("has-success");
        $("#check_name").hide();
        return true;
    } else {
        $(".name").removeClass("has-success");
        $("#check_name").show();
        $(".name").addClass("has-danger");
        return false;
    }
}

function validatePhone() {
    phone = $("#input_phone").val();
    if (phone.match(/^(\+380|0)\d{9}$/)) {
        $(".phone").removeClass("has-danger");
        $(".phone").addClass("has-success");
        $("#check_phone").hide();
        return true;
    } else {
        $(".phone").removeClass("has-success");
        $(".phone").addClass("has-danger");
        $("#check_phone").show();
        return false;
    }
}

function validateAddress() {
    address = $("#input_address").val();
    if (address) {
        $(".address").removeClass("has-danger");
        $(".address").addClass("has-success");
        $("#check_address").hide();
        return true;
    } else {
        $(".address").removeClass("has-success");
        $(".address").addClass("has-danger");
        $("#check_address").show();
        return false;
    }
}

function initializeValidation() {
    $("#input_phone").on("input", function () {
        validatePhone();
    });
    $("#input_address").on("input", function () {
        if(validateAddress())
            inputAddress($("#input_address").val());
    });
    $("#input_name").on("input", function () {
        validateName();
    });
}

function initSubmit() {
    var API = require("../API");
    var Cart = require("./PizzaCart");
    var cart = Cart.getPizzaInCart();
    var body;
    var order;
    $("#btn-submit").click(function () {
        if (formIsValid()) {
            order = [];
            cart.forEach(function (pizza_cart) {
                order.push([pizza_cart.pizza.title, pizza_cart.size[1], pizza_cart.quantity]);
            });
            body = {
                order: order,
                recipient: name,
                address: address,
                phone: phone,
                total_price: Cart.totalPrice()
            };
            API.createOrder(body, function (err, data) {
                if(!err)
                    checkOut(data.data, data.signature);
            });

        }
    });
}

function checkOut(data, signature){
    LiqPayCheckout.init({
        data:	data,
        signature:	signature,
        embedTo:	"#liqpay",
        mode:	"popup"
    }).on("liqpay.callback",	function(data){
        if(data.status==="sandbox")
            alert("Successfully sent");
        else
            alert("Failed to send");
    }).on("liqpay.ready",	function(data){

    }).on("liqpay.close",	function(data){

    });
}

function formIsValid() {
    var a = validateName();
    var b = validatePhone();
    var c = validateAddress();
    return a && b && c;
}

function geocodeLatLng(latlng, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function geocodeAddress(address,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new	Error("Can	not	find	the	adress"));
        }
    });
}

function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
        if	(	status	==	google.maps.DirectionsStatus.OK )	{
            route.setDirections(response);
            var leg	=	response.routes[0].legs[0];
            callback(null,	{
                duration:	leg.duration
            });
        }	else	{
            callback(new	Error("Can'	not	find	direction"));
        }
    });
}

function showRout(A_latlng,	 B_latlng) {
    calculateRoute(A_latlng, B_latlng, function (err, data) {
       if(!err){
           $(".delivery_time").text(" " + data.duration.text);
       }
    });
}

function showMap() {
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 15
    };
    var html_element = document.getElementById("map");
    MAP = new google.maps.Map(html_element, mapProp);
    var pizza_marker = new google.maps.Marker({
        position: new google.maps.LatLng(50.464379, 30.519131),
        map: MAP,
        icon: "assets/images/map-icon.png"
    });
    google.maps.event.addListener(MAP, 'click', function (me) {
        // var coordinates	= me.latLng;
        var point = me.latLng;
        if (mark)
            mark.setPosition(point);
        else {
            mark = new google.maps.Marker({
                position: point,
                map: MAP,
                icon: "assets/images/home-icon.png"
            });
        }

        clickLatLng(point);
    });
    var rendererOptions = {
        map: MAP,
        suppressMarkers : true
    };
    route =  new google.maps.DirectionsRenderer(rendererOptions);
}
function inputAddress(address){
    $(".delivery_address").text(address);
    var point;
    geocodeAddress(address, function (err, data) {
        if(!err){
            point = data;
            if (mark)
                mark.setPosition(point);
            else {
                mark = new google.maps.Marker({
                    position: point,
                    map: MAP,
                    icon: "assets/images/home-icon.png"
                });
            }
            showRout(new google.maps.LatLng(50.464379, 30.519131), point);
        }

    });
}

function clickLatLng(latlng){
    geocodeLatLng(latlng, function (err, data) {
        if(!err){
            $(".delivery_address").text(data);
            $("#input_address").val(data);
            showRout(new google.maps.LatLng(50.464379, 30.519131), latlng);
        }
    });
}

exports.initSubmit = initSubmit;
exports.initializeValidation = initializeValidation;
exports.showMap = showMap;