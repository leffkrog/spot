import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import albumsReducer from '../reducers/albumsReducer';
import artistsReducer from '../reducers/artistsReducer';
import playlistReducer from '../reducers/playlistReducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        albums: albumsReducer,
        artists: artistsReducer,
        playlist: playlistReducer
    }),
    // The redux-thunk middleware, which allows simple asynchronous use of dispatch.
    composeEnhancers(applyMiddleware(thunk))
);

export default store;