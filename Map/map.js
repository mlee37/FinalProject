var Main;

import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GraphicsLayer.js";
import MapView from "https://js.arcgis.com/4.33/@arcgis/core/views/MapView.js";
import Search from "https://js.arcgis.com/4.33/@arcgis/core/widgets/Search.js";
import FeatureLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/FeatureLayer.js"
import Legend from "https://js.arcgis.com/4.33/@arcgis/core/widgets/Legend.js"


Main = (function() {
    const map = new Map({
        basemap: "gray-vector", 
    });
    
    const view = new MapView({
  container: "map",
  map: map,
  center: [-107, 41],
  zoom: 5,

  popup: {
    dockEnabled: true,
    dockOptions: {
      position: "bottom-left",
      breakpoint: false
    }
  }
});


view.on("click", function(event) {
        view.goTo({
            target: event.mapPoint,
            zoom: 10
        });
 });

 const featureLayer = new FeatureLayer ({
    url: "https://services3.arcgis.com/HVjI8GKrRtjcQ4Ry/arcgis/rest/services/WNP_Chapters/FeatureServer"
});
map.add(featureLayer);

const pointsLayer = new FeatureLayer({
  source: myStuff.map((value, i) => ({
    geometry: { type: "point", longitude: value.lon, latitude: value.lat },
    attributes: { ObjectID: i + 1, ...value }
  })),
  objectIdField: "ObjectID",
  fields: [
    { name: "ObjectID", type: "oid" },
    { name: "name", type: "string" },
    { name: "town", type: "string" },
    { name: "cohort", type: "string" },
    { name: "interests", type: "string" },
    { name: "email", type: "string" }
  ],
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      style: "point",
      size: 4,
      color: [0, 0, 0],
    }
  },
  
  popupTemplate: {
    title: "{name}", 
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "name", label: "Name" },
          { fieldName: "town", label: "Town of Residence" },
          { fieldName: "cohort", label: "Cohort" },
          { fieldName: "interests", label: "Service Interests" },
          {fieldName: "email", label: "Email"}
        ]
      }
    ]
  },
  featureReduction: {
    type: "cluster",
    clusterRadius: "100px",
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    clusterZoomOnClick: false,
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: { expression: "Text($feature.cluster_count, '#,###')" },
      symbol: { type: "text", color: "white", font: { weight: "bold", size: "12px" } },
      labelPlacement: "center-center"
    }]
  }
});

map.add(pointsLayer);

      
const searchWidget = new Search({
  view: view
});

view.ui.add(searchWidget, {
  position: "top-right",
  index: 2
});

let legend = new Legend({
  view: view,
  layerInfos: [
    {
      layer: featureLayer,
      title: "WNP Chapters"
    }
  ]
});

view.ui.add(legend, "bottom-left");

            
})();



    
