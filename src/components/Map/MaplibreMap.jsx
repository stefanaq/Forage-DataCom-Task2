import 'maplibre-gl/dist/maplibre-gl.css';
//added popup to maplibre import
import Map, { Marker, Popup, useMap } from 'react-map-gl';
import { useState } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from 'maplibre-gl';
import useEventListener from '@use-it/event-listener';
import { useSnackbar } from 'notistack';
import { MapContextProvider } from './context';
import { totalBounds } from '../../data/bounds';
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
maplibregl.workerClass = maplibreglWorker;

//new maplibre marker component
const MaplibreMarker = ({
  lat,
  lon,
  name,
  address,
  phoneNumber
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <Marker
        longitude={lon}
        latitude={lat}
        anchor="bottom"
      >
        <button
          type="button"
          aria-label={`Show details for ${name || "cinema"}`}
          onClick={(event) => {
            event.stopPropagation();
            setPopupOpen(true);
          }}
          style={{
            cursor: "pointer",
            border: "none",
            borderRadius: "50%",
            padding: "6px",
            background: "#1976d2",
            color: "white",
            fontSize: "18px"
          }}
        >
          🎬
        </button>
      </Marker>

      {popupOpen && (
        <Popup
          longitude={lon}
          latitude={lat}
          anchor="bottom"
          closeOnClick={false}
          onClose={() => setPopupOpen(false)}
        >
          <div style={{ maxWidth: "220px" }}>
            <strong>{name || "Cinema"}</strong>

            {address && (
              <p style={{ margin: "6px 0" }}>
                {address}
              </p>
            )}

            {phoneNumber && (
              <a href={`tel:${phoneNumber}`}>
                {phoneNumber}
              </a>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

const convertBounds = ([w, s, e, n]) => ([
  // MapLibre expects bounds to be [LngLatBoundsLike](https://maplibre.org/maplibre-gl-js-docs/api/geography/#lnglatboundslike)
  // as such the are either LngLat objects in [sw, ne] order or an array of numbers in [w, s, e, n] order.
  [w, s], [e, n]
]);

const MapSnappingEventListener = () => {
  const { enqueueSnackbar } = useSnackbar();
  const map = useMap().current;
  useEventListener('map.snapTo', ({ detail: { lat, lng } }) => {
    // This hook sets up an event listener for the map.snapTo event which
    // is currently dispatched be an onClick function in CinemaListItem 
    console.log('executing `map.snapTo` event with maplibre')

    try {
      // [Docs](https://maplibre.org/maplibre-gl-js-docs/api/map/#map#flyto)
      //swapped lng and lat then added essential
      map.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true
      })
    } catch (e) {
      console.error(e);
      enqueueSnackbar('Unexpected error while attempting map navigation', { variant: 'error' });
    }
  })
  return null;
};

const MaplibreMap = ({ children }) => {
  console.log("render Maplibre map");
  return (
    <Map
      mapLib={maplibregl}
      mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=46DCXvzkGNIvqAgCljGV"
      initialViewState={{
        bounds: convertBounds(totalBounds),
      }}
      //added max bounds for restricting map to australia and newzealand
      maxBounds={convertBounds(totalBounds)}
      padding={24}
    >
      <MapSnappingEventListener />
      <MapContextProvider value={{ Marker: MaplibreMarker }}>
        {children}
      </MapContextProvider>
    </Map>
  );
};
export default MaplibreMap;
