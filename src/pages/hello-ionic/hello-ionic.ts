import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import leaflet from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  markInit: any;
  markEnd: any;
  markerGroup: any;

  constructor(
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.map = leaflet.map("map"); //.fitWorld();
    leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.locate({
      setView: true,
    }).on('locationfound', (e) => {
      this.markerGroup = leaflet.featureGroup();
      this.markInit = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Marker clicked');
      })
      this.markerGroup.addLayer(this.markInit);
      this.map.addLayer(this.markerGroup);
    }).on('locationerror', (err) => {
      alert(err.message);
    }).on('click', (e) => {
      if (this.markEnd != null) {
        this.map.removeLayer(this.markEnd);
      }
      this.markEnd = leaflet.marker(e.latlng);
      this.markerGroup.addLayer(this.markEnd);
      var curPos = this.markInit.getLatLng();
      leaflet.Routing.control({
        waypoints: [
          leaflet.latLng(curPos.lat, curPos.lng),
          leaflet.latLng(e.latlng)
        ]
      }).addTo(this.map);
    })
  }
}
