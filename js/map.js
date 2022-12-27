
var map = L.map('map',{
  fullscreenControl: true,
  fullscreenControlOptions: { // optional
    title:"Mostrar mapa completo!!!",
    titleCancel:"Salir del mapa completo"}
}).setView([-13.294552811,-72.124746442], 14); // Urubamba
// 13, 21
map.options.minZoom = 1;
map.options.maxZoom = 28;

var fondo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)



var cartodb = {
  'OSM:':L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
  'ESRI SATELITE:':L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
};


// sector

var tg_sectores = L.geoJson(tg_sectores, {
  className: 'sector',
  onEachFeature: function (feature,layer) {
      layer.bindTooltip('Sector: ' + feature.properties.cod_sector ,{
       permanent: true,
       direction: 'center',
       className: 'sectorTooltip',
      })
}
}).addTo(map);

// manznas 
var tg_manzana = L.geoJson(tg_manzana, {
  className: 'manzana',
  /*
  onEachFeature: function (feature,layer) {
    layer.bindTooltip(feature.properties.cod_mzna ,{
     permanent: true,
     direction: 'center',
     className: 'mzTooltip',
    })
}
*/
}).addTo(map);

// vias
var tg_vias = L.geoJson(tg_vias, {
  onEachFeature: function (feature, layer) {
      layer.setText(feature.properties.tipo_via + '. ' + feature.properties.nomb_via,
      {offset: 0,
      //orientation: 'flip', 
      repeat: false,
      center: true,
      attributes: {'font-weight': '700','align': 'center', 'font-size': '10','font-family': 'Open Sans'}});
  },
  style: {
      weight: 0,
      color: 'blue',
      dashArray: '4, 4'
  }

})
// edificas
var estilocanchis = {
  'color': '#808080',
  'weight': 0.5
}
var edifica = L.geoJson(edifica, {
  style: estilocanchis,
}).addTo(map);

// servidumbre
var servidumbre = L.geoJson(servidumbre, {
  className: 'line' 
}).addTo(map);

// terreno comun
var estilocanchis = {
  'color': '#00bfff',
  'weight': 0.5,
}
var terreno_comun = L.geoJson(terreno_comun, {
  style: estilocanchis,
}).addTo(map);


// tg_lote

function Infoerp(feature, layer) {
  if (feature.properties && feature.properties.cod_lote) {
      layer.bindPopup("<h1>Informacion del Lote</h1>"
      +"<b>ID_LOTE: </b>"+feature.properties.id_lote+"</b><br>"
      +"<b>CUC: </b>"+feature.properties.cuc+"</b><br>"
      +"<b>Ubigeo: </b>"+"081301"+"</b><br>"
      +"<b>Sector: </b>"+feature.properties.cod_sector+"</b><br>"
      +"<b>Manzana: </b>"+feature.properties.cod_mzna+"</b><br>"
      +"<b>Lote: </b>"+feature.properties.cod_lote+"</b><br>"
      +"<b>Area_m2: </b>"+feature.properties.area_grafica+"</b><br>"
      +"<b>Perimetro_m: </b>"+feature.properties.peri_grafico+"</b><br>"
      +"<b>Foto: </b><br>"+'<center><img src=' + feature.properties.foto + ' height="200px" width="200px"/></center>');
  }
}

//'<img src=" + feature.properties.foto + " height="150px" width="150px"/>'
//"<img iframe width=300 height=169 src=" + feature.properties.foto + "frameborder = allowfullscreen></iframe>"

// show
var tg_lote = L.geoJson(tg_lote, {
  className: 'lote',
  onEachFeature: Infoerp,
}).addTo(map)

// tg_pto_geodesicos
function infopto(feature, layer) {
  if (feature.properties && feature.properties.codigo) {
      layer.bindPopup("<b>Codigo: </b>"+feature.properties.codigo+"</b><br>"
      +"<b>Este: </b>"+feature.properties.coord_x+"</b><br>"
      +"<b>Norte: </b>"+feature.properties.coord_y+"</b><br>"
    +"<b>Latitud: </b>"+feature.properties.coord_lat+"</b><br>"
    +"<b>Longitud: </b>"+feature.properties.coord_long+"</b><br>"
    +"<b>Altura ELipsoidal: </b>"+feature.properties.alti_geo+"</b><br>"
    +"<b>Orden: </b>"+feature.properties.orden+"</b><br>"
  +"<b>Metodo: </b>"+feature.properties.meto_lev+"</b><br>"
  +"<b>Datum: </b>"+feature.properties.datum+"</b><br>"
  +"<b>Certificado: </b>" +  '<a href=' + feature.properties.info+' target="_blank">Clic Certificado!!!</a>'
  
  );
  }
}


var marker_pto= new L.Icon({
  iconSize: [21, 21],
  iconAnchor: [9, 21],
  popupAnchor:  [1, -24],
  iconUrl: 'https://percyelbis.github.io/app_leaflet_gnss/images/pg.svg'
});

// Show
var tg_pto_geodesicos = L.geoJson(tg_pto_geodesicos, {
onEachFeature: infopto,
pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: marker_pto});
}
}).addTo(map)



/*
// Layer Control
var baseMaps = {
    
    //"Google Satellite": satellite,
    //"OpenStreetMap": osmLayer,
    "Mapa base": cartodb,

};
*/

// layers

var overlayMaps = {
    "LOTE": tg_lote,
    "SECTORES": tg_sectores,
    "MANZANA": tg_manzana,
    "EDIFICA": edifica,
    "SERVIDUMBRE": servidumbre,
    "COMUN": terreno_comun,
    "Puntos Geodesicos": tg_pto_geodesicos,
    'Vias': tg_vias,
};

var control = L.control.layers(cartodb, overlayMaps, {
  collapsed: true,
  autoZIndex: true,
}).addTo(map);


// Medicion
L.control.polylineMeasure({
  unit: 'Meters',
  measureControlTitleOn: 'Medir en metros',
  measureControlTitleOff: 'Apagar',

}).addTo(map);
// Coordenadas
L.control.mousePosition().addTo(map);

// user
map.pm.addControls({
  position: 'topleft',
  drawCircle: false,
  drawPolyline: false,
  drawRectangle: false,
  cutPolygon: false,
  editPolygon: false,
  dragLayer: false,
  rotateMode: false,
  dragMode: false,
  drawCircleMarker: false,
  oneBlock: true,
});


// zoom ventana
L.Control.boxzoom({ 
  position:'topright',
  title:'Zoom Windows'
 }).addTo(map);





// detect fullscreen toggling
map.on('enterFullscreen', function(){
  if(window.console) window.console.log('enterFullscreen');
});
map.on('exitFullscreen', function(){
  if(window.console) window.console.log('exitFullscreen');
});
/*
// logo 1
var credctrl = L.controlCredits({
  image: "images/city.svg",
  link: "https://catastrourubamba.github.io/",
  text: "<b>Mejoramiento del Servicio de Información Predial Urbana del Distrito de Urubamba</b>",
}).addTo(map);

var customActionToPrint = function(context, mode) {
	return function() {
		window.alert("We are printing the MAP. Let's do Custom print here!");
		context._printMode(mode);
	}
};
*/
// logo 2
var credctrl = L.controlCredits({
  image: "images/3d.svg",
  link: "https://catastrourubamba.github.io/3d/",
  text: "<strong>Ver Pisos</strong><br/><b>3D!!!</b>",
}).addTo(map);

var bar = L.controlCredits({
  image: "images/bar.svg",
  link: "https://catastrourubamba.github.io/tablero/",
  text: "<strong>Ver Tablero de Control</strong><br/><b>Tablero!!!</b>",
}).addTo(map);

var customActionToPrint = function(context, mode) {
	return function() {
		window.alert("We are printing the MAP. Let's do Custom print here!");
		context._printMode(mode);
	}
};



// search id_catastral

/*
var searchControl = new L.Control.Search({
  layer: tg_lote,
  propertyName: "id_cuc",
  circleLocation: true,
  zoom: 21
});

searchControl.on('search_locationfound', function(e) {
  e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});

})


map.addControl(searchControl);
*/
var searchControl = new L.control.search({
  layer: tg_lote,
  initial: false,
  propertyName: 'id_cuc',
  zoom: 21,
  buildTip: function(text, val) {
    var type = val.layer.feature.properties.amenity;
    return '<a href="#" class="'+type+'">'+text+'<b>'+' ID_LOTE | CUC '+'</b></a>';
  }
})

map.addControl(searchControl);


// grid
/*
var grid = L.grid().addTo(map);

L.control.layers({
  'Stamen Watercolor': layer
  
}, {
  'L.Grid': grid

}, {
  collapsed: true,
  position: 'bottomright',

}).addTo(map);
*/


// leyenda
const legend = L.control.Legend({
  position: "bottomright",
  title: "Leyenda",
  collapsed: true,
  symbolWidth: 24,
  opacity: 0.9,
  column: 1,
  legends: [{
    label: "Manzana",
    type: "rectangle",
    color: "cyan",
    fillColor: "rgba(0, 255, 255, 0.51)",
    weight: 2
}, {
    label: "Lote",
    type: "polygon",
    sides: 4,
    color: "rgb(0, 0, 0)",
    fillColor: "rgba(0, 0, 0, 0)",
    weight: 2
},{
    label: "Sector",
    type: "polygon",
    sides: 7,
    color: "#7c00a5",
    fillColor: "rgba(0, 0, 0, 0.20)",
    weight: 2
},{
  label: "Servidumbre",
  type: "polygon",
  sides: 5,
  color: "rgba(0, 0, 0, 0.942)",
  fillColor: "rgba(0, 0, 0, 0.1)",
  dashArray: [5, 5],
  weight: 2
},{
  label: "Edifica",
  type: "rectangle",
  color: "#808080",
  fillColor: "rgba(0, 0, 0, 0.20)",
  weight: 2
},{
  label: "Terreno Comun",
  type: "polygon",
  sides: 5,
  color: "#00bfff",
  fillColor: "rgba(0, 0, 0, 0.20)",
  weight: 2
}]
})
.addTo(map);

// bienvenida
var notification = L.control
    .notifications({
        timeout: 3000,
        position: 'topright',
        closable: true,
        dismissable: true,
    })
    .addTo(map);



//custom options per notification
notification.success('Bienvenido', '💙 Urubamba 💙 Es Unico!!!', {
    timeout: 6000,
    closable: false,
    dismissable: false,
    icon: 'fa fa-check-circle',
    className: 'important-alert',
});
// advertencia
notification.alert('Alerta', 'La app web corre mas veloz en escritorio.', {
  timeout: 8000,
  closable: false,
  dismissable: false,
  icon: 'fa fa-times-circle',
  className: 'important-alert',
});

// vias
notification.info('Info', 'Activar solo si es necesario la capa Vias.', {
  timeout: 10000,
  closable: false,
  dismissable: false,
  icon: 'fa fa-info-circle',
  className: 'important-info',
});

var modernNotifications = L.control.notifications({ className: 'modern' }).addTo(map);


	  
/* contents */
const right = '<div class="header">---</div>';
let contents = `
      <div class="content">
      <p>La Municipalidad de Urubamba ofrece el libre acceso a la información cartográfica Catastral.</p>
          <div class="title">¿Que es Catastro?</div>
          <p>Inventario de unidades inmobiliarias desde aspectos físicos, jurídicos, fiscales, económicos y culturales.</p>       
          <div class="title">Proyecto</div>
          <p><b>Mejoramiento del Servicio de Información Predial Urbana del Distrito de Urubamba</b></p>
          <div class="title">Misión</div>
          <p><b>Declarar Urubamba como Zona Catastrada.</b></p>
          <div class="title">Vision</div>
          <p><b>Líder entre las entidades generadoras de Catastro en el Perú.</b></p>
          <div class="title">Tutorial 2022</div>
          <a href="https://youtu.be/iT-Yh0IjTIM">&#127760 Ver Tutorial &#127760</a>
      </div>`;


/* right */
const slideMenu = L.control
  .slideMenu("", {
    position: "topright",
    menuposition: "topright",
    width: "30%",
    height: "400px",
    delay: "50",
    icon:  'fa-solid fa-bars',
  })
  .addTo(map);
slideMenu.setContents(right + contents);
