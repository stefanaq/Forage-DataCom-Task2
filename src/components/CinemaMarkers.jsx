import { useMemo } from "react";
import { useParams } from "react-router-dom";
import allCinemas from "../data/cinemas";
import { useMapContext } from './Map/context';

const CinemaMarkers = () => {
  const { Marker } = useMapContext();
  const params = useParams();
  const cinemas = useMemo(() => {
    if (params.franchiseId || params.countryCode) {
      const { franchiseId, countryCode } = params;
      return allCinemas.filter(cinema => {
        return (
          franchiseId === 'all-cinemas' ||
          cinema.franchise === franchiseId
        ) && cinema.countryCode === countryCode;
      })
    }

    return allCinemas;
  }, [params]);

  return cinemas.map((cinema, idx) => {
return (
  //New cinema marker
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

export default CinemaMarkers;