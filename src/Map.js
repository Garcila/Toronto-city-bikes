import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

import './styles/map.css';

const Stations = ({ text }) => <div className='station'>{text}</div>;

class Map extends Component {
  static defaultProps = {
    center: { lat: 43.6452, lng: -79.3806 },
    zoom: 17
  };

  constructor(props) {
    super(props);

    this.state = {
      stations: []
    };
  }

  componentDidMount() {
    const url = `https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information`;
    axios.get(url).then(result => {
      this.setState({ stations: result.data.data.stations });
    });
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
    return (
      <div className="google-map">
        <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {stations}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
