import useNearbyCinemas from "../data/nearbyCinemas";
import { useMapContext } from './Map/context';

const NearbyCinemaMarkers = () => {
  const { Marker } = useMapContext();
  const { cinemas } = useNearbyCinemas();

  return cinemas.map((cinema, idx) => {
return (
  // New cinema marker
  <Marker
    lat={cinema.lat}
    lon={cinema.lng}
    name={cinema.name}
    address={cinema.address}
    phoneNumber={cinema.phoneNumber}
    key={`${cinema.countryCode}-${cinema.name}-${idx}`}
  />
);
  })
};

export default NearbyCinemaMarkers;