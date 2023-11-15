

$( document ).ready(function() {

    $("#content").hide();
    $("#loader").show();
    
    $("#loader").fadeOut("fast", function() {
        setTimeout(() => {
            $("#loader").removeClass('bg-light');
        }, 1000);
    });  
    
    $("#content").fadeIn("fast", function() {
    });   

    $( "#headerTop" ).load(" #headerTop > *");
    AOS.init();
})