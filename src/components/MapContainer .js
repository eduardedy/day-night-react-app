import React from "react";
import { GoogleApiWrapper, Map , InfoWindow, Marker } from "google-maps-react"; 
 


class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      markers: [
        {
          title: "The marker`s title will appear as a tooltip.",
          name: "SOMA",
          position: { lat: 44.913539334255155, lng: 26.024701314458866 }
        }
      ], 
      sunrise:'',
      sunset: '',
      timeAbroad: '',
      dayNight: ''
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(t, map, coord) {
    const { latLng } = coord;
    const lat =  latLng.lat();
    const lng =   latLng.lng();

    // get new location time  
    var apiKey2 = 'SC4L9GNRWSOC'
    var url2 = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey2}&format=json&by=position&lat=${lat}&lng=${lng}`
     fetch(url2)  
    .then(res => res.json())        
    .then(timezone => { 
      let locSelectedTime = new Date(timezone.formatted).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
      this.setState({timeAbroad: locSelectedTime}) 
    }) 
 
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  
    // get new location certain data
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`
    fetch(url)  
        .then(res => res.json())        
        .then(text => {   
          let dayNight;

          if(this.state.timeAbroad >= text.results.sunrise   &&  this.state.timeAbroad <  text.results.sunset){
            dayNight = 'Day'
          }else{
            dayNight = 'Night'
          }
    
          this.setState(previousState => {
            return { 
              markers: [ 
                {  
                  name: dayNight,
                  position: { lat, lng }
                }
              ],
              sunrise: text.results.sunrise,
              sunset: text.results.sunset,
              dayNight: dayNight
            };
          });  
        })  
     
  }
 

  test = () => { 
    console.log(this.state) 
  }
 

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    }); 
  }
 
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }


   
  };

  render() {

    console.log(this.state)

   // const {userLocation} = this.state
    return (
      <div> 
        <h1 className="text-center" onClick={this.test}>My Maps</h1>
        <Map
          google={this.props.google}
          style={{ width: "80%", margin: "auto" }}
          className={"map"}
          zoom={14}
      initialCenter={this.state.markers[0].position}
          onClick={  this.onClick   }
        >
          {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              title={marker.title}
              name={marker.name}
              position={marker.position}
              onClick={this.onMarkerClick}
            />
          ))}

<InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>


        </Map>
      </div>
    );
  }
}



export default GoogleApiWrapper({
  apiKey: "AIzaSyChYfdaurKnRjh0S4FjeKpaOIBk6sP-egs"
})(MapContainer);