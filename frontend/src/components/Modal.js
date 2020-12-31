import React, { useState, useRef } from 'react'
import { Modal, Button, Form, Row } from 'react-bootstrap'
import SearchResult from './items/Results'
import axios from 'axios'

export default function CollectionModal(props) {
  const collection = props.collection
  const sources = {
    movies: 'TMDB (TheMoveDatabase.org)',
    seris: 'TMDB (TheMoveDatabase.org)',
    anime: 'Jikan API (MyAnimeList.net)',
    manga: 'Jikan API (MyAnimeList.net)',
    asian_drama: 'Kuryana API (MyDramaList.com)',
    books: 'OpenLibrary.org',
  }

  const [addModal, setAddModal] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState({})
  const searchInput = useRef(null)

  // handle cover images
  // it returns false if there
  // are no cover images present
  // from the response
  const handleCoverImage = (type, res) => {
    if (type === 'movies' || type === 'series') {
      if (res.poster_path === undefined || res.backdrop_path === undefined) {
        return false
      }
    } else if (type === 'anime' || type === 'manga') {
      if (res.image_url === undefined) {
        return false
      }
    } else if (type === 'asian_drama') {
      if (res.thumb === undefined) {
        return false
      }
    } else if (type === 'books') {
      if (res.cover_i === undefined) {
        return false
      }
    }

    return true
  }

  // main handler for searching items
  const handleSearch = (e) => {
    // prevent auto-form submit and reload
    e.preventDefault()

    setSearching(true)
    if (collection.type === 'movies') {
      return GetMoviesSeries('movie')
    } else if (collection.type === 'series') {
      return GetMoviesSeries('tv')
    } else if (collection.type === 'anime') {
      return GetAnimeManga('anime')
    } else if (collection.type === 'manga') {
      return GetAnimeManga('manga')
    } else if (collection.type === 'asian_drama') {
      return GetKDrama()
    } else if (collection.type === 'books') {
      return GetBooks()
    }
  }

  // movies & series handlers || both have similar API structures
  // REACT_APP_TMDB_KEY => set this TMDB api with your own
  const GetMoviesSeries = (type) => {
    axios
      .get(
        `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&query=${searchInput.current.value}&page=1&include_adult=false`,
      )
      .then((res) => {
        const data = res.data

        setSearchResults(data.results)
        setSearching(false)
      })
      .catch((err) => console.error(err))
  }

  // anime & manga handlers || both have similar API structures
  const GetAnimeManga = (type) => {
    axios
      .get(
        `https://api.jikan.moe/v3/search/${type}?q=${searchInput.current.value}&page=1`,
      )
      .then((res) => {
        const data = res.data

        setSearchResults(data.results)
        setSearching(false)
      })
      .catch((err) => console.error(err))
  }

  // kdrama handler
  const GetKDrama = () => {
    axios
      .get(`https://kuryana.vercel.app/search/q/${searchInput.current.value}`)
      .then((res) => {
        const data = res.data

        setSearchResults(data.results)
        setSearching(false)
      })
      .catch((err) => console.error(err))
  }

  // books handler
  const GetBooks = () => {
    axios
      .get(
        `http://openlibrary.org/search.json?title=${searchInput.current.value}&page=1`,
      )
      .then((res) => {
        const data = res.data

        setSearchResults(data.results)
        setSearching(false)
      })
      .catch((err) => console.error(err))
  }

  return (
    <>
      <div>
        <Modal.Header>
          <div className="d-flex align-items-center">
            <Modal.Title>
              <h3 className="font-weight-bold text-primary">
                {collection.name}
              </h3>
            </Modal.Title>
            <span className="text-muted font-weight-bold ml-3">
              ({collection.type})
            </span>
          </div>
          <div>
            <Button variant="success" onClick={() => setAddModal(true)}>
              Add New Item
            </Button>
          </div>
        </Modal.Header>
      </div>

      <Modal
        show={addModal}
        onHide={() => setAddModal(false)}
        size="lg"
        backdrop="static"
        animation={false}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            find and add new{' '}
            <span className="font-weight-bold">{collection.type}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-75 mx-auto">
            <Form onSubmit={handleSearch}>
              <Form.Group controlId="collection-name">
                <Form.Label>
                  Search the title of the {collection.type} to add
                </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    ref={searchInput}
                    required
                    size="lg"
                    type="text"
                    placeholder="Title of the new item..."
                    // onChange={(e) => setColName(e.target.value)}
                  />
                  <Button variant="primary" className="ml-2 py-2" type="submit">
                    Find
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </div>

          {/* searching for item message */}
          {searching ? (
            <div>
              <p>Finding for item '{searchInput.current.value}'...</p>
            </div>
          ) : null}

          {/* search output */}
          {searchResults.length > 0 ? (
            <div className="mt-2">
              <h6>
                Results provided by: <span>{sources[collection.type]}</span>
              </h6>

              <hr />

              <div>
                <Row md={3}>
                  {searchResults.map((res) =>
                    handleCoverImage(collection.type, res) ? (
                      <SearchResult
                        key={searchResults.indexOf(res)}
                        result={res}
                        type={collection.type}
                      />
                    ) : null,
                  )}
                </Row>
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  )
}
