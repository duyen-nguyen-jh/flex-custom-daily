import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
const defaultLocations = [
  {
    id: 'default-helsinki',
    predictionPlace: {
      address: 'Ho Chi Minh, Viet Nam',
      bounds: new LatLngBounds(new LatLng(11.16021, 107.01265), new LatLng(10.34937, 106.36387)),
    },
  },
  {
    id: 'default-turku',
    predictionPlace: {
      address: 'Beach Road, Singapore',
      bounds: new LatLngBounds(new LatLng(1.30450, 103.86662), new LatLng(1.30181, 103.86392)),
    },
  },
];
export default defaultLocations;
