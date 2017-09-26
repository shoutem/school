import PlaceDetails from './screens/PlaceDetails';
import { PlacesListScreen } from './screens/PlacesList';
import PlacesListWithIcons from './screens/PlacesListWithIcons';
import MediumPlaceDetails from './screens/MediumPlaceDetails';
import SinglePlaceMap from './screens/SinglePlaceMap';
import FavoritesList from './screens/FavoritesList';
import FavoritesListWithIcons from './screens/FavoritesListWithIcons';
import reducer from './reducers';
import * as actions from './action';

export const screens = {
  PlaceDetails,
  PlacesListScreen,
  PlacesListWithIcons,
  SinglePlaceMap,
  MediumPlaceDetails,
  FavoritesList,
  FavoritesListWithIcons,
};

export { reducer };
export { actions };
