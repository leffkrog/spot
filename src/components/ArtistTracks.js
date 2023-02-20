import React, {useState} from 'react';
import {
  addTrackToPlayList,
  getArtistTracks,
} from '../actions/result';

import {
  useParams
} from 'react-router-dom'
import {Form, Button} from "react-bootstrap";


const ArtistTracks = (props) => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [first, setFirst] = useState(false);
  const [tracks, setTracks] = useState([]);
  const {isValidSession, history} = props;
  const [filterTerm, setFilterTerm] = useState('');
  const [printTerm, setPrintTerm] = useState(false);
  const {artistId} = useParams();

  let tmpId = localStorage.getItem('selectedListId');
  let tmpName = localStorage.getItem('selectedListName');

  if (!first) {
    getArtistTracks(artistId).then(result => {
          setTracks(result);
          setIsLoaded(true);
        }
    );
    setFirst(true);
  }

  const handleInputChangeFilter = (e) => {
    setFilterTerm(e.target.value);
  };

  const handleInputPrintable = () => {
    setPrintTerm(!printTerm);

    tracks.sort(function (a, b) {
      return (a.popularity < b.popularity ? -1 : 1);
    });
  };

  const sortByIdx = (e) => {
    tracks.sort(function (a, b) {
      return (a.popularity < b.popularity ? -1 : 1);
    });
  };

  const addToList = async (trackId) => {
    if (isValidSession()) {
      await addTrackToPlayList(trackId, tmpId);
    } else {
      history.push({pathname: '/', state: {session_expired: true}});
    }
  };

  const addAllToList = async () => {
    if (isValidSession()) {
      for (let i=0; i<tracks.length ; i++) {
          await addTrackToPlayList(tracks[i].id, tmpId);
        console.log('added ' + i + ' id: ' + tracks[i].id);
      }
    } else {
      history.push({pathname: '/', state: {session_expired: true}});
    }
  };

 if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
        <div>
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
                <pre>SAVE TO: {tmpName} </pre>
                <div className="formcol">
                  <Form.Check type="checkbox" value={printTerm} label="printable" onChange={handleInputPrintable}/>
                </div>
                <div className="formcol">
                  <Button className="search-buttons" onClick={addAllToList}>
                    Save All
                  </Button>
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
                
                  <th onClick={sortByIdx}>idx</th>
                </tr>
                </thead>
                <tbody>

                {tracks.map((item, index) => {

                  let releaseDate = item.album.release_date != null ? item.album.release_date : '??';
                  let albumName = item.album.name != null ? item.album.name : '??';
                  albumName = item.album.name.split(' ').slice(0,2).join(' ');
                
                  if (filterTerm === '' || releaseDate.startsWith(filterTerm)) {
                    return (
                        <tr key={index}>
                          <td>{item.artists[0].name}</td>
                          <td>{item.name}</td>
                          <td>({albumName})</td>
                          <td>{item.popularity}</td>

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
                {tracks.map((item, index) => {

                      let trackName = item.name;
                      let artistName = ""
                      let releaseDate = item.album.release_date != null ? item.album.release_date : '??';
                      let albumName = item.album.name.split(' ').slice(0,2).join(' ');
                      
                      for (let i=0 ; i< item.artists.length ; i++){
                          artistName += item.artists[i].name + " / ";
                      }
                      artistName = artistName.substr(0, artistName.length -2);
                     
                      
                      return (
                          <pre key={item.id} className="printablefont">{index+1} {artistName}: {trackName} ({albumName}){item.popularity}</pre>
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

export default ArtistTracks;