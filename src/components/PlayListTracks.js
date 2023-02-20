import React, {useState} from 'react';
import {
  addTrackToPlayList,
  getPlaylistTracks,
} from '../actions/result';

import {
  useParams
} from 'react-router-dom'
import {Form} from "react-bootstrap";


const PlayListTracks = (props) => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [first, setFirst] = useState(false);
  const [tracks, setTracks] = useState([]);
  const {isValidSession, history} = props;
  const [filterTerm, setFilterTerm] = useState('');
  const [printTerm, setPrintTerm] = useState(false);
  const {playId} = useParams();

  if (!first) {
    getPlaylistTracks(playId).then(result => {
          setTracks(result);
          setIsLoaded(true);
        }
    );
    setFirst(true);
  }

  const handleInputChangeFilter = (e) => {
    setFilterTerm(e.target.value);
  };


  const handleInputPrintable = (e) => {
    if (printTerm ? setPrintTerm(false) : setPrintTerm(true)) ;
    tracks.items.sort(function (a, b) {
      return (a.track.popularity < b.track.popularity ? 1 : -1);
    });
  };

  const sortByIdx = (e) => {
    console.log('sort')
    tracks.items.sort(function (a, b) {
      return (a.track.popularity < b.track.popularity ? 1 : -1);
    });
  };

  let tmpId = localStorage.getItem('selectedListId');
  let tmpName = localStorage.getItem('selectedListName');

  const addToList = async (trackId) => {
    if (isValidSession()) {
      await addTrackToPlayList(trackId, tmpId);
    } else {
      history.push({pathname: '/', state: {session_expired: true}});
    }
  };

 if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
        <div>
          <pre className="search-form">{tracks.total} låtar i listan</pre>
          <pre className="search-form">SAVE TO: {tmpName}  </pre>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <div className="formrow">
                <div className="formcolw">
                  <Form.Control
                      type="search"
                      name="filterTerm"
                      value={filterTerm}
                      placeholder="Filter on date"
                      onChange={handleInputChangeFilter}
                      autoComplete="off"
                  />
                </div>
                <div className="formcol">
                  <Form.Check type="checkbox" value={printTerm} label="printable" onChange={handleInputPrintable}/>
                </div>
              </div>
            </Form.Group>

          </Form>

          {Object.keys(tracks).length > 0 && !printTerm && (
              <table className="styled-table">
                <thead>
                <tr>
                  <th>artist</th>
                  <th>titel</th>
                  <th>album</th>
                  <th>date</th>
                  <th></th>
                  <th></th>
                  <th onClick={sortByIdx}>idx</th>
                </tr>
                </thead>
                <tbody>

                {tracks.items.map((item, index) => {

                  let releaseDate = item.track.album.release_date != null ? item.track.album.release_date : '??';
                  let albumName = item.track.album.name != null ? item.track.album.name : '??';

                  if (filterTerm === '' || releaseDate.startsWith(filterTerm)) {
                    return (
                        <tr key={index}>
                          <td>{item.track.artists[0].name}</td>
                          <td>{item.track.name.split('-')[0]}</td>
                          <td>{albumName.split('-')[0].split('(')[0]}</td>
                          <td>{releaseDate}</td>
                          <td>
                            <div onClick={() => addToList(item.track.id)}>add</div>
                          </td>
                          <td>delete</td>
                          <td>{item.track.popularity}</td>

                        </tr>
                    );
                  }
                  return "";
                })}
                </tbody>
              </table>
          )}

          {Object.keys(tracks).length > 0 && printTerm && (
              <div className="printablefont">
                {tracks.items.map((item, index) => {

                      let releaseDate = item.track.album.release_date != null ? item.track.album.release_date : '??';
                      let albumName = item.track.album.name != null ? item.track.album.name : '??';
                      albumName = albumName.split('-')[0].split('(')[0];
                      let trackName = item.track.name.split('- ')[0].split('(')[0];
                      let artistName = item.track.artists[0].name;
                      let popularity = item.track.popularity

                      return (
                          <pre key={item.track.id} className="printablefont">{artistName}: {trackName} ({albumName} {releaseDate}) p:{popularity}</pre>
                      );
                    }
                )
                }
              </div>
          )}
        </div>
    );
  }
};

export default PlayListTracks;