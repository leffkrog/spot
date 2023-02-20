import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
const SearchForm = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleInputChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm.trim() !== '') {
            setErrorMsg('');
            props.handleSearch(searchTerm);
        } else {
            setErrorMsg('Please enter a search term.');
        }
    };
    return (
        <div className="search-form">
            <Form onSubmit={handleSearch}>
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Type search term and hit ENTER</Form.Label>
                    <Form.Control
                        type="search"
                        name="searchTerm"
                        value={searchTerm}
                        placeholder="Search for album, artist or playlist"
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                </Form.Group>
               {/* <Button variant="info" type="submit">
                    Search
                </Button>*/}

            </Form>
        </div>
    );
};
export default SearchForm;