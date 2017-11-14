import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import mergeByKey from 'array-merge-by-key';

import './styles/map.css';

//mapStyle contains a JSON object with the custom styles for the map
//styles built with google tool
import { mapStyle } from './styles/mapStyle';

function createMapOptions(maps) {
  return {
    panControl: true,
    mapTypeControl: true,
    scrollwheel: true,
    styles: mapStyle
  };
}

//components Stations and Me to be redered with stations locations and
//my location in the map
const Stations = ({ text }) => <div className="station">{text}</div>;

const Me = ({ text }) => <div className="me">{text}</div>;

class Map extends Component {
  static defaultProps = {
    center: { lat: 43.6452, lng: -79.3806 },
    zoom: 15
  };

  constructor(props) {
    super(props);

    this.state = {
      stationsLocation: [],
      stationsInfo: [],
      stations: [],
      meLat: '',
      meLng: ''
    };
  }

  async componentDidMount() {
    const urlStationLocation = `https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information`;
    const urlStationInfo = `https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_status`;

    await axios.get(urlStationLocation).then(result => {
      this.setState({ stationsLocation: result.data.data.stations });
    });

    await axios.get(urlStationInfo).then(result => {
      this.setState({ stationsInfo: result.data.data.stations });
    });

    const stations = mergeByKey(
      'station_id',
      this.state.stationsLocation,
      this.state.stationsInfo
    );
    this.setState({ stations });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          meLat: position.coords.latitude,
          meLng: position.coords.longitude
        });
      });
    }
  }

  render() {
    const stations = this.state.stations.map(s => {
      if (s.lat) {
        return (
          <Stations
            key={s.station_id}
            lat={s.lat}
            lng={s.lon}
            text={`${s.num_bikes_available}/${s.capacity}`}
          />
        );
      }
      return null;
    });

    const meCenter = [this.state.meLat, this.state.meLng];

    return (
      <div className="google-map">
        <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          center={meCenter}
          layerTypes={['TrafficLayer', 'TransitLayer']}
          options={createMapOptions}
        >
          <Me lat={this.state.meLat} lng={this.state.meLng} text="ME" />
          {stations}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
