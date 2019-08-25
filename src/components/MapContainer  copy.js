import React from "react";
import { GoogleApiWrapper, Map } from "google-maps-react";
//Aici
export class MapContainer extends React.Component {
    state = { userLocation: { lat: 32, lng: 32 }, loading: true };
  
    componentDidMount(props) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
  
          this.setState({
            userLocation: {},   // { lat: latitude, lng: longitude },
            loading: false
          });
        },
        () => {
          this.setState({ loading: false });
        }
      );
    }
  
    render() {
        const { loading, userLocation } = this.state;
        const { google } = this.props;
        const userLocation2 = {
            lat: 44.9363968,
            lng: 28.012876799999997
        }


      if (loading) {
        return null;
      }
  
      return <Map google={google} initialCenter={userLocation2} zoom={10} />;
    }
  }

export default GoogleApiWrapper({
  apiKey: "AIzaSyChYfdaurKnRjh0S4FjeKpaOIBk6sP-egs"
})(MapContainer);