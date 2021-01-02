import React from 'react'
import { Col, Image, Button } from 'react-bootstrap'

export default function SearchResult(props) {
  const result = props.result

  var resTitle = ''
  var resCover = ''

  // movies
  if (props.type === 'movies') {
    // set result title
    if (result.release_date !== undefined) {
      resTitle = result.title + ' (' + result.release_date.split('-')[0] + ')'
    } else {
      resTitle = result.title
    }

    // set result cover
    if (result.poster_path !== undefined) {
      resCover =
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
        result.poster_path.replace('/', '')
    } else {
      resCover =
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
        result.backdrop_path.replace('/', '')
    }
  }
  // series
  else if (props.type === 'series') {
    // set result title
    if (result.first_air_date !== undefined) {
      resTitle = result.name + ' (' + result.first_air_date.split('-')[0] + ')'
    } else {
      resTitle = result.name
    }

    // set result cover
    if (result.poster_path !== undefined) {
      resCover =
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
        result.poster_path.replace('/', '')
    } else {
      resCover =
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
        result.backdrop_path.replace('/', '')
    }
  }
  // anime || manga
  else if (props.type === 'anime' || props.type === 'manga') {
    // set result title
    if (result.start_date !== undefined) {
      resTitle = result.title + ' (' + result.start_date.split('-')[0] + ')'
    } else {
      resTitle = result.title
    }

    // set result cover
    resCover = result.image_url
  }
  // asian dramas
  else if (props.type === 'asian_drama') {
    // set result title
    if (result.year !== undefined) {
      resTitle = result.title + ' (' + result.year + ')'
    } else {
      resTitle = result.title
    }

    // set result cover
    resCover = result.thumb.replace('s.jpg', 'c.jpg')
  }
  // books
  else if (props.type === 'books') {
    // set result title
    resTitle = result.title

    // set result cover
    resCover = `https://covers.openlibrary.org/b/id/${result.cover_i}-L.jpg`
  }

  return (
    <Col>
      <div className="mb-4 bg-light">
        <div>
          <Image fluid src={resCover} />
        </div>
        <div className="text-center mt-2 p-3">
          <h5 className="font-weight-light">{resTitle}</h5>
          <Button
            variant="primary"
            onClick={() => props.handleAddNewItem(resCover, resTitle)}
          >
            add item
          </Button>
        </div>
      </div>
    </Col>
  )
}
