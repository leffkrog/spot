import {
  SET_ALBUMS,
  ADD_ALBUMS,
  SET_ARTISTS,
  ADD_ARTISTS,
  SET_PLAYLIST,
  ADD_PLAYLIST
} from '../utils/constants';
import {del, get, post} from '../utils/api';

export const setAlbums = (albums) => ({
  type: SET_ALBUMS,
  albums
});

export const addAlbums = (albums) => ({
  type: ADD_ALBUMS,
  albums
});

export const setArtists = (artists) => ({
  type: SET_ARTISTS,
  artists
});

export const addArtists = (artists) => ({
  type: ADD_ARTISTS,
  artists
});

export const setPlayList = (playlists) => ({
  type: SET_PLAYLIST,
  playlists
});

export const addPlaylist = (playlists) => ({
  type: ADD_PLAYLIST,
  playlists
});

export const initiateGetResult = (searchTerm) => {
  return async (dispatch) => {
    try {
      const API_URL = `https://api.spotify.com/v1/search?query=${encodeURIComponent(
          searchTerm
      )}&type=album,playlist,artist`;
      const result = await get(API_URL);
      const {albums, artists, playlists} = result;
      dispatch(setAlbums(albums));
      dispatch(setArtists(artists));
      dispatch(setPlayList(playlists));
      return;
    } catch (error) {
      console.log('error', error);
    }
  };
};

export async function getPlaylistTracks(searchTerm) {

  try {

    const API_URL = `https://api.spotify.com/v1/playlists/${encodeURIComponent(searchTerm)}`;
    const result = await get(API_URL);
    console.log(result);
    let {tracks} = result;
    let next = tracks.next;

    while (next != null && next.length > 1) {
      let nextResult = await get(next);
      next = nextResult.next;
      tracks.items = [...tracks.items, ...nextResult.items];
    }

    return tracks;

  } catch (error) {
    console.log('error', error);
  }
}

export async function getArtistTracks(artistId) {

  try {
    let loadMoreAlbums = true;
    let albumIds = [];

    let offsetAlbums = 0;
    while (loadMoreAlbums) {
      const API_URL = `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/albums?limit=50&offset=${offsetAlbums}`;
      const result = await get(API_URL);
      let {items} = result;

      if (items.length > 50) {
        console.log("THERE ARE MORE ALBUMS FOR THIS ARTIST lets load more" + items.length)
        offsetAlbums += 50;
      } else {
        loadMoreAlbums = false;
      }
      for (let i = 0; i < items.length; i++) {
        albumIds.push(items[i].id);
      }
      console.log('we have ' + albumIds.length + ' so far');
    }
    console.log('Album ids: ' + albumIds.length);

    let allTracks = [];
    for (let i = 0; i < albumIds.length; i++) {
      let offset = 0;
      let trackIds = [];

      let loadMoreTracks = true;
      while (loadMoreTracks) {
        let API_URL_TRACK = `https://api.spotify.com/v1/albums/${encodeURIComponent(albumIds[i])}/tracks?limit=50&offset=${offset}`;
        let resultTrack = await get(API_URL_TRACK);
        let {items} = resultTrack;

        for (let trackIndex = 0; trackIndex < items.length; trackIndex++) {
          for (let j = 0; j < items[trackIndex].artists.length; j++) {
            if (items[trackIndex].artists[j].id === artistId) {
              trackIds.push(items[trackIndex].id);
            }
          }
        }
        if (items.length >= 50) {
          offset += 50;
          console.log('more than 50 tracks in this album do offset at: ' + offset);
        } else {
          loadMoreTracks = false;
        }
      }

      console.log('we have ' + trackIds.length + ' track ids for this album.');
      if (trackIds.length > 0) {
        while (trackIds.length >= 50){
          console.log('we have more than 50 lets split.')
          let extraTrackIds = trackIds.splice(0,50);
          let extraTrackIdsStr = extraTrackIds.join(',');
          let API_URL_TRACKS_EXTRA = `https://api.spotify.com/v1/tracks/?ids=${encodeURIComponent(extraTrackIdsStr)}`;
          let resultTracksExtra = await get(API_URL_TRACKS_EXTRA);
          allTracks = [...allTracks, ...resultTracksExtra.tracks];
        }
        let trackIdsStr = trackIds.join(',');
        let API_URL_TRACKS = `https://api.spotify.com/v1/tracks/?ids=${encodeURIComponent(trackIdsStr)}`;
        let resultTracks = await get(API_URL_TRACKS);
        allTracks = [...allTracks, ...resultTracks.tracks];
      }
    }

    console.log(allTracks);
    return allTracks;

  } catch (error) {
    console.log('error', error);
  }
}

async function getTracksFull(trackString) {
  let API_URL_TRACKS = `https://api.spotify.com/v1/tracks/?ids=${encodeURIComponent(trackString)}`;
  let resultTracks = await get(API_URL_TRACKS);
  console.log(resultTracks);
  console.log("done in funciton")
  return resultTracks;
}

export const initiateLoadMoreAlbums = (url) => {
  return async (dispatch) => {
    try {
      const result = await get(url);
      return dispatch(addAlbums(result.albums));
    } catch (error) {
      console.log('error', error);
    }
  };
};

export async function addTrackToPlayList(trackId, toListId) {

  try {

    if (toListId == null || toListId.length < 10) {
      console.log('No valid list id: ' + toListId);
      return;
    }

    const TRACK_ID = "spotify:track:" + trackId;
    const API_URL_CHECK = `https://api.spotify.com/v1/playlists/${encodeURIComponent(toListId)}`;
    const resultCheck = await get(API_URL_CHECK);
    const {tracks} = resultCheck;

    if (JSON.stringify(tracks).includes(trackId)) {
      console.log('exists already')
    } else {
      const API_URL = `https://api.spotify.com/v1/playlists/${encodeURIComponent(toListId)}/tracks?uris=${encodeURIComponent(TRACK_ID)}`;
      await post(API_URL);
      console.log('added the track')
    }

    return;
  } catch (error) {
    console.log('error', error);
  }

}

export async function removeTracksFromPlayList(trackId, toListId) {
  try {
    const TRACK_ID = '{ "tracks": [{ "uri": "spotify:track:' + trackId + '" } }] }';
    const API_URL = `https://api.spotify.com/v1/playlists/${encodeURIComponent(toListId)}/tracks?uris=${encodeURIComponent(TRACK_ID)}`;
    await del(API_URL);
    return;
  } catch (error) {
    console.log('error', error);
  }
}

export const initiateLoadMoreArtists = (url) => {
  return async (dispatch) => {
    try {
      const result = await get(url);
      return dispatch(addArtists(result.artists));
    } catch (error) {
      console.log('error', error);
    }
  };
};

export const initiateLoadMorePlaylist = (url) => {
  return async (dispatch) => {
    try {
      const result = await get(url);
      return dispatch(addPlaylist(result.playlists));
    } catch (error) {
      console.log('error', error);
    }
  };
};