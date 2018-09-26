
//MAP & GOOGLE API SCRIPT

//Sender
$('#map').locationpicker({
  location: {
    latitude: 3.1412, 
    longitude: 101.68653
  },
  enableAutocomplete: true, 
  enableReverseGeocode: true,
  zoom:10,
  radius: 300,
  inputBinding: {
    locationNameInput: $('#postcode-sender')
  },
  onchanged: function (currentLocation, radius, isMarkerDropped) {
    var addressComponents = $(this).locationpicker('map').location.addressComponents;
    updateControls(addressComponents); //Data
    $('input[name=sender-postcode]').val(addressComponents.postalCode);
  },
         
});

function updateControls(addressComponents) {

  console.log(addressComponents.postalCode);
  $("#postcode").val(addressComponents.postalCode);
}
//receiver
$('#map-receiver').locationpicker({
  location: {
    latitude: 3.1412, 
    longitude: 101.68653
  },
  enableAutocomplete: true, 
  enableReverseGeocode: true,
  zoom:10,
  radius: 300,
  inputBinding: {
    locationNameInput: $('#postcode-receiver')
  },
  onchanged: function (currentLocation, radius, isMarkerDropped) {
    var addressComponents = $(this).locationpicker('map').location.addressComponents;
    updateControls(addressComponents); //Data
    $('input[name=receiver-postcode]').val(addressComponents.postalCode);
  },
         
});

function updateControls(addressComponents) {

  //console.log(addressComponents.postalCode);
  $("#postcode").val(addressComponents.postalCode);
}

//Form validation

//validate location/validate sender/receiver postcode
$("#validate-location").click(checkPostcode);
$("#sender-postcode").on('change keydown paste input', checkPostcode);
$("#validate-location-receiver").click(checkPostcodeReceiver);
$("#receiver-postcode").on('change keydown paste input', checkPostcodeReceiver);

function checkPostcode(){

  let postcode = $("#sender-postcode").val();
  let postcode_string = './'; //to be change with server url
  let postcode_json = postcode_string.concat(postcode+".json");
  var postcode_valid = false;

  //checking starts when input is more than 4 characters
  if (postcode != null && postcode.length > 4) {

  var getJSON = function(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status == 200) {
            resolve(xhr.response);
          } else {
            reject(status);
          }
        };
        xhr.send();
      });
    };

    getJSON(postcode_json).then(function(data) {
              
        if(data.postcode==99999){
          postcode_valid=false;
        }
        else{
          postcode_valid=true;
        }

        if (postcode_valid){
              $("#sender-postcode").removeClass("wrong-validated");
              $("#sender-input-error").removeClass("error-msg");
              $("#sender-postcode").addClass("validated");
            }
            else{
              $("#sender-postcode").removeClass("validated");
              $("#sender-postcode").addClass("wrong-validated");
              $("#sender-input-error").addClass("error-msg");
              $("#delivery-calculator").submit(function(e){
            });
            }
      }
      , function(status) { //error detection....
            console.log('Something went wrong.');
          }); 
    
        //receiver condition            
          }else {
            console.log("no input");
            $("#receiver-input-error").removeClass("error-msg");
        }

      
}
//checking postcode receiver
function checkPostcodeReceiver(){

  let postcode = $("#receiver-postcode").val();
  let postcode_string = './'; //to be change with server url
  let postcode_json = postcode_string.concat(postcode+".json");
  var postcode_valid = false;

  //checking starts when input is more than 4 characters
  if (postcode != null && postcode.length > 4) {

  var getJSON = function(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status == 200) {
            resolve(xhr.response);
          } else {
            reject(status);
          }
        };
        xhr.send();
      });
    };

    getJSON(postcode_json).then(function(data) {
              
        if(data.postcode==99999){
          postcode_valid=false;
        }
        else{
          checkPostcodeReceiver(true);
          postcode_valid=true;
        }

        if (postcode_valid){
              $("#receiver-postcode").removeClass("wrong-validated");
              $("#receiver-input-error").removeClass("error-msg");
              $("#receiver-postcode").addClass("validated");
            }
            else{
              $("#receiver-postcode").removeClass("validated");
              $("#receiver-postcode").addClass("wrong-validated");
              $("#receiver-input-error").addClass("error-msg");
              $("#delivery-calculator").submit(function(e){
            });
            }
      }
      , function(status) { //error detection....
            console.log('Something went wrong.');
          }); 
    
        //receiver condition            
          }else {
            console.log("no input");
            $("#receiver-input-error").removeClass("error-msg");
        }
}

//only numbers form input
$("#sender-postcode,#receiver-postcode,#size-height,#size-width,#size-length,#weight-display").on('change keydown paste input',function inputvalidate(evt)
      {

         var charCode = (evt.which) ? evt.which : evt.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
});

$("#weight").on('change',function(evt)
    {
      let weight = $("#weight").val();
      $('input[name=weight-display]').val(weight);
    });
$("#weight-display").on('change keydown paste input',function(evt)
    {
      let weight = $("#weight-display").val();

      if(weight<=25){
        $('#weight').slider('setValue', weight);
      }
      else{
        $('#weight').slider('setValue', 25);
      }
    });

//calculate function

$('#calculate').click(function(){
  //get value
  let postcode_sender = $("#sender-postcode").val();
  let postcode_receiver = $("#receiver-postcode").val();
  let parcel_weight = $("#weight").val();
  let parcel_height = $("#size-height").val();
  let parcel_length = $("#size-length").val();
  let parcel_width = $("#size-width").val();
  let delivery_id = $("input[name='radio-button']:checked").val();
  let delivery_type;
  let parcel_volumetric = parseInt(parcel_width)+parseInt(parcel_length)+parseInt(parcel_height);

  let total;

  let calculate_rate_api = './'; //to be change with server url
  let calculate_rate_json = calculate_rate_api.concat("weight="+parcel_weight+"&size="+parcel_volumetric+".json");

  if(delivery_id==0){
    delivery_type="Super Express Delivery";
  }else if(delivery_id==1){
    delivery_type="Express Delivery";
  }else{
    delivery_type="Normal Delivery";
  }

  var getJSON = function(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status == 200) {
            resolve(xhr.response);
          } else {
            reject(status);
          }
        };
        xhr.send();
      });
    };

    getJSON(calculate_rate_json).then(function(data) {
              
        if(delivery_id==0){
          total=data.data.thrd_kv;
        }
        else if(delivery_id==1){
          total=data.data.sdd_kv;
        }
        else if(delivery_id==2){
          total=data.data.ndd_kv;
        }
        $("#result-total-default").addClass("hide-result");  
        $("#result-total").addClass("show-result");
        $("#result-total").html('<h2>RM'+total+'</h2>');

        //DOM manipulation for result summary div
        $( "#result" ).addClass("setVisible");
        $("#result-div").addClass("setShadow");
        console.log(total);

        $( "#result" )
        .html( "<div class='delivery-summary'><h1>Delivery Summary</h1>"+
               "<table><tr><td width='60%'>Your Postcode</td><td width='40%'><strong>"+postcode_sender+
               "</strong></td><tr><td>Receiver Postcode</td><td><strong>"+postcode_receiver+
               "</strong></td><tr><td>Parcel Weight</td><td><strong>"+parcel_weight+"kg"+
               "</strong></td><tr><td>Parcel Volumetric <span style='font-size:0.7em'>(H+L+W)</span></td><td><strong>"+parcel_volumetric+"kg"+
               "</strong></td><tr><td>Delivery Type</td><td><strong>"+delivery_type +"</td></tr></table></div>" );

      }
      , function(status) { //error detection....
            console.log('Something went wrong.');
          }); 
/*
  //parcel weight
  switch(parcel_id){
    case '2': weight_calc=5;parcel_weight="0 - 5kg";
            break;
    case '3': weight_calc=7;parcel_weight="6 - 10kg";
            break;
    case '4': weight_calc=10;parcel_weight="11 - 15kg";
            break;
    case '5': weight_calc=15;parcel_weight="16 - 20kg";
            break;
    case '6': weight_calc=20;parcel_weight="21 - 25kg";
            break;
    default:weight_calc=5;parcel_weight="0kg";break;
  }

  //volumetric calculation
  if(parcel_volumetric<=60){
    parcel_volum_calc=5;
  }
  else if(parcel_volumetric > 60 && parcel_volumetric <=100){
    parcel_volum_calc=10;
  }else if(parcel_volumetric > 100 && parcel_volumetric <=150){
    parcel_volum_calc=15;
  }else if(parcel_volumetric > 150 && parcel_volumetric <=180){
    parcel_volum_calc=20;
  }else{
    parcel_volum_calc=20;
  }

  //Parcel Type
  if(delivery_id==0){
    delivery_type = "Super Express";  delivery_type_calc=30;
  }else if(delivery_id==1){
    delivery_type = "Express"; delivery_type_calc=20;
  }else{
    delivery_type = "Normal"; delivery_type_calc=5;
  }

  //weight vs volumetric comparison
  if(parcel_volum_calc > weight_calc){
    vol_wei_compare = parcel_volum_calc;
  }
  else{
    vol_wei_compare = weight_calc;
  }

  //result
  total = delivery_type_calc + distance_calc + vol_wei_compare;*/

  
});

