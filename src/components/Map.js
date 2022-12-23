import React from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Map = () => {
  // const key = "AIzaSyDWTx7bREpM5B6JKdbzOvMW-RRlhkukmVE";
  // const key = "AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8";
  // const key = "AIzaSyDaOulQACiJzBfqumbsqg_-vKha8fCnL-s";
  const key = "AIzaSyDc7PnOq3Hxzq6dxeUVaY8WGLHIePl0swY";

  const defaultProps = {
    center: {
      lat: 21.028511,
      lng: 105.804817,
    },
    zoom: 11,
  };

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: key }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
