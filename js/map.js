
var apiURL = "http://findaparty.victordgrd.fr/FaP_API.php"
var myStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ],featureType: "road",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    },
    { elementType: "geometry", stylers: [{ color: "#1A1A1A" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#FFFFFF" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#000000" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }],
    }
];

initMap()
function initMap() {
    mapzoom = 3
    
    $("#mapError").hide()
    //Création de la carte sur le div html
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: parseFloat(mapzoom),
        maxZoom: 16,
        minZoom: 7,
        center: new google.maps.LatLng(47.39540828619915, 0.6855415952479273),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        styles: myStyles,
        disableDefaultUI: true
    });
    google.maps.event.addListener(map,"idle", function(){
        $("#loadingMap").remove()
    });
    
    
    var geocoder = new google.maps.Geocoder();
    
    $.post( apiURL, {action : 'getLocations', platform: "mobile"})
    .done(function( data ) {
        result = JSON.parse(data)
        result['locations'].forEach(marker => {
            coords = marker.Coords.split(', ')
            const latlng = { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
            cityCircle = new google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.15,
                map,
                title: marker.City,
                center: latlng,
                radius: 2000,
            });
            
            
        });
    });
    
    
    if (navigator.geolocation) {
        console.log(navigator.geolocation);
        navigator.geolocation.getCurrentPosition((position) => {
            pos = {lat: position.coords.latitude,lng: position.coords.longitude,};
            geocodeLatLng(geocoder, position.coords.latitude, position.coords.longitude)
            setLocalisation(pos)
        },
        () => { handleLocationError(true)});
    } else {
        handleLocationError(false);
    }
    
    
    function setLocalisation(pos) {
        marker = new google.maps.Marker({
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: {                             
                url: "https://api.find-a-party.fr/images/pin-here.png",
                scaledSize: new google.maps.Size(20, 40),
            }
            
        });
        
        map.setCenter(pos);
        map.setZoom(parseFloat(mapzoom));
        
    }
    
    function handleLocationError(browserHasGeolocation) {
        console.log(browserHasGeolocation? "Erreur: le service de géolocalisation a échoué.": "Erreur: Ton navigateur ne prend pas en charge la géolocalisation.");
    }
    
    function geocodeLatLng(geocoder, lat, lng) {
        const latlng = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        };
        
        geocoder.geocode({ location: latlng }).then((response) => {
            if (response.results[0]) {
                loc = response.results[0].address_components[2].long_name
                window.localStorage.setItem("localisation_name", loc)
                window.localStorage.setItem("localisation_coords", JSON.stringify(latlng))
                localisation_coords = latlng
                localisation_name = loc
                if( $('#textHome').val()==""){
                    $('#textHome').val(loc)
                }
            }
        }).catch((e) => console.log("Geocoder failed due to: " + e));
    }
    
}
