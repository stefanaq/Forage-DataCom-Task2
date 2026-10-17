import {
  MapContainer,
  // Rectangle,
  TileLayer,
  Marker,
  //added popup from leaflet
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import useEventListener from "@use-it/event-listener";
import { useSnackbar } from "notistack";
import { totalBounds } from "../../data/bounds";
import MapContext from "./context";
// Have to override these url's so that it finds the bundles the correct images
Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/";

const MapSnappingEventListener = () => {
  const { enqueueSnackbar } = useSnackbar();
  const map = useMap();
  useEventListener("map.snapTo", ({ detail: { lat, lng } }) => {
    // This hook sets up an event listener for the map.snapTo event which
    // is currently dispatched be an onClick function in CinemaListItem
    console.log("executing `map.snapTo` event with leaflet");

    try {
      // [Docs](https://leafletjs.com/reference.html#map-flyto)
      map.flyTo([lat, lng], 14, { duration: 0.5, easeLinearity: 1 });
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Unexpected error while attempting map navigation", {
        variant: "error"
      });
    }
  });
  return null;
};

const convertBounds = ([w, s, e, n]) => [
  // Leaflet expects boundings boxes to be an array consisting of the corners of the box.
  // These corners are [lat, lon] [LatLng docs](https://leafletjs.com/reference.html#latlng)
  [s, w],
  [n, e]
];

//New leaflet marker component that adds information to map points
const LeafletMarker = ({
  lat,
  lon,
  name,
  address,
  phoneNumber
}) => (
  <Marker position={[lat, lon]}>
    <Popup>
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
    </Popup>
  </Marker>
);

const LeafletMap = ({ children }) => {
  console.log("render Leaflet map");
  return (
    <>
      <MapContainer
        bounds={convertBounds(totalBounds)}
        //added maxbounds and viscosity for restricting map to australia and new zealand
        maxBounds={convertBounds(totalBounds)}
        maxBoundsViscosity={1}
        style={{ height: "100%", backgroundColor: "#99b3cc" }}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        <MapSnappingEventListener />
        <TileLayer
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}"
          subdomains="abcd"
          minZoom={0}
          maxZoom={18}
          ext="png"
        />
        <MapContext.Provider value={{ Marker: LeafletMarker }}>
          {children}
        </MapContext.Provider>
        {/* {[...allCountryBounds, totalBounds].map((bounds, idx) => (
          <Rectangle bounds={convertBounds(bounds)} key={idx} />
        ))} */}
      </MapContainer>
    </>
  );
};
export default LeafletMap;
