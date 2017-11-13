import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

import './styles/map.css';

const Stations = ({ text }) => <div className='station'>{text}</div>;

const Me = ({ text }) => <div className='me'>{text}</div>;

class Map extends Component {
  static defaultProps = {
    center: { lat: 43.6452, lng: -79.3806 },
    zoom: 17
  };

  constructor(props) {
    super(props);

    this.state = {
      stations: [],
      meLat: '',
      meLng: ''
    };
  }

  componentDidMount() {
    const url = `https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information`;
    axios.get(url).then(result => {
      this.setState({ stations: result.data.data.stations });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({ 
            meLat: position.coords.latitude,
            meLng: position.coords.longitude
          });
        }
      )}
  }

  render() {
    const stations = this.state.stations.map(s => {
      return (
        <Stations
          key={s.station_id}
          lat={s.lat}
          lng={s.lon}
          text={s.capacity}
        />
      );
    });        

    const center = { lat: this.state.meLat, lng: this.state.meLng };

    return (
      <div className="google-map">
        <GoogleMapReact
          defaultCenter={center}
          defaultZoom={this.props.zoom}
        >
          <Me lat={this.state.meLat} lng={this.state.meLng} text='ME' />
          {stations}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
