// Country bounds drawn via http://bboxfinder.com/
// they are currently in the follow format [W, S, E, N]
const countryBounds = {
  au: [112.669086, -43.696673, 153.726368, -10.737187],
  nz: [166.332922, -47.292562, 178.573837, -34.394162],
}
// 166.509144322, -46.641235447, 178.517093541, -34.4506617165
export const allCountryBounds = Object.values(countryBounds);
// latitude is West (-) to East (+)
// longitude is North (+) to South (-)

//changed bounds calculation to make more space
export const totalBounds = [
  107,   // more room west of Australia
  -52,   // more room south of NZ
  179.9, // room east of NZ, staying below 180°
  -6,    // more room north of Australia
];