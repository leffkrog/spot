import React, {useState} from 'react';
import {Card} from 'react-bootstrap';
import _ from 'lodash';
import music from '../images/music.jpeg';
import {useHistory} from "react-router-dom";

const PlayList = (props) => {

  const [addToListIdTerm, setAddToListIdTerm] = useState('-');
  const {playlist} = props
  const history = useHistory();

  let tmpId = localStorage.getItem('selectedListId');
  if (tmpId != null && tmpId.length > 1 && addToListIdTerm === '-') {
    setAddToListIdTerm(tmpId);
  }

  const handleClick = (e) => {
    e.preventDefault();
    history.push({pathname: '/playListTracks/' + e.target.name});
  };

  const handleSaveClick = (e) => {
   e.preventDefault();
    setAddToListIdTerm(e.target.id);
    console.log('have set '+ e.target.id);
    console.log('have set '+ e.target.name);
    localStorage.setItem('selectedListId', e.target.id);
    localStorage.setItem('selectedListName',  e.target.name);
  };

 function isSelected(id) {
   return (addToListIdTerm === id);
  }

  return (
      <div>
        {Object.keys(playlist).length > 0 && (
            <div className="playlist">
              {playlist.items.map((item, index) => {
                if (item.tracks.total > -1) {
                  return (
                      <React.Fragment key={index}>
                        <Card style={{width: '18rem'}}>
                          <a
                              target="_blank"
                              href="{item.external_urls.spotify}"
                              rel="noopener noreferrer"
                              className="card-image-link"
                          >
                            {!_.isEmpty(item.images) ? (
                                <Card.Img variant="top" src={item.images[0].url} alt=""/>
                            ) : (
                                <img src={music} alt=""/>
                            )}
                          </a>
                          <Card.Body>
                            <Card.Title>
                              <a
                                  target="_self"
                                  href="#"
                                  onClick={handleClick}
                                  name={item.id}
                                  rel="noopener noreferrer"
                                  className="card-image-link"
                              >
                                {item.name}
                              </a>
                              # {item.tracks.total}
                              {!isSelected(item.id) ? (
                                  <a
                                      target="_self"
                                      href="#"
                                      onClick={handleSaveClick}
                                      id={item.id}
                                      name={item.name}
                                      rel="noopener noreferrer"
                                      className="card-image-link"
                                  >
                                    {item.id}
                                  </a>
                              ) : (
                                  <pre>SELECTED</pre>
                              )}

                            </Card.Title>
                            <Card.Text>
                              <small>By {item.owner.display_name}</small>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </React.Fragment>
                  );
                }
              })}
            </div>

        )}

      </div>
  );
};

export default PlayList;