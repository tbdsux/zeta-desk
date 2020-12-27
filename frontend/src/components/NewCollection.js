import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal as ColModal,
  Form,
  Alert,
  Row,
  Col,
  Container,
} from 'react-bootstrap'

import Modal from 'react-modal'
import * as Wails from '@wailsapp/runtime'

export default function NewCollection() {
  // main adding and updating form modal
  const [modal, setModal] = useState(false)
  // new item added
  const [loadOnce, setLoadOnce] = useState(true)
  // alert messages
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  // collection modal
  const [rmodal, setRModal] = useState(false)
  const [update, setUpdate] = useState(false)
  // to be updated item
  const [upItem, setUpItem] = useState({})
  // collections
  const [collections, setCollections] = useState([])
  const [saved, setSaved] = useState(false)
  const [modified, setModified] = useState(false)

  // close form modal
  const closeModal = () => {
    // reset the alert message
    setAlertMessage('')

    // close modal
    setModal(false)
  }

  // show form modal
  const showModal = () => {
    setModal(true)
    setUpdate(false)
  }

  // checks if the collection exists in the current array
  const checkIfExists = (collection) => {
    // collection is similar with upItem
    if (
      collection.name === upItem.name &&
      collection.description === upItem.description &&
      collection.type === upItem.type
    ) {
      closeModal()
      return null
    }

    // collection.name is the same but the other two is not
    if (
      collection.name === upItem.name &&
      (collection.description !== upItem.description ||
        collection.type !== upItem.description)
    ) {
      return false
    }

    const chk = collections.filter((col) => {
      return col.name === collection.name
    })
    if (chk.length > 0) {
      return true
    }

    // doesn't fit any condition above
    return false
  }

  // refurb the array
  // this will change the id of each item
  // in order to avoid having similar id
  const refurbArray = () => {
    if (collections.length > 0) {
      var colx = collections

      for (var i = 0; i < collections.length; i++) {
        colx[i].id = i
      }

      setCollections(colx)
    }
  }

  // handle form and inputs
  const handleFormSubmit = (name, desc, type) => {
    refurbArray()

    // set new item
    const item = {
      id: collections.length,
      name: name,
      description: desc,
      type: type,
      itemList: name.replace(' ', '_').toLowerCase() + '.js',
    }

    const check = checkIfExists(item)

    // check first if the item exists from the current one
    if (check === true) {
      setAlertMessage(
        'Collection name already exists! Change it and try again.',
      )
      setAlert(true)
    } else if (check === false) {
      setAlert(false)

      // if update form
      // remove first the collection
      if (update) {
        handleRemoveCollection(upItem, false)
      }

      // set new states
      setCollections([...collections, item])
      setModified(true)

      // close the modal after
      closeModal()
    }
  }

  // handle form submission
  // for `updating` and `creating` collection
  const submitForm = (e) => {
    e.preventDefault()

    // get form input values
    const name = document.getElementById('collection-name').value.trim()
    const desc = document.getElementById('collection-description').value.trim()
    const type = document.getElementById('collection-type').value.trim()

    // check if blank
    if (name === '' || desc === '' || type === '') {
      setAlertMessage('Please fill in all of the inputs below and try again.')
      setAlert(true)
    } else {
      // submit the form
      handleFormSubmit(name, desc, type)
    }
  }

  // handle showing of collection modal
  const handleModal = (e) => {
    e.preventDefault()

    // open modal
    setRModal(true)
  }

  // handle removing of collection
  const handleRemoveCollection = (collection, remove) => {
    // remove the collection
    var newCols = collections
    const index = newCols.indexOf(collection)
    newCols.splice(index, 1)
    for (var i = 0; i < newCols.length; i++) {
      newCols[i].id = i
    }

    // set new state
    setCollections(newCols)

    refurbArray()

    // do not execute this if doing
    // update on a collection
    if (remove) {
      setModified(true)
    }
  }

  // handle updating of collection details
  const handleUpdateCollection = (collection) => {
    // set update states
    setModal(true)
    setUpdate(true)
    setUpItem(collection)
  }

  // load collections from file
  const loadCollections = () => {
    window.backend.Collections.LoadCollections().then((list) => {
      try {
        setCollections(JSON.parse(list))

        setModified(false)
      } catch (e) {
        // this will crash the app,
        // todo: add handler and show the error on the ui
        console.error(e)
      }
    })
  }

  useEffect(() => {
    Wails.Events.On('datamodified', () => {
      // if not set, it will loop around
      // might be a bug with the fsnotify watcher
      // I don't know why this works though
      if (saved && modified) {
        loadCollections()
        setSaved(false)
      }
    })
  }, [saved, modified, collections])

  useEffect(() => {
    // this will only load the
    // list once on startup
    if (loadOnce) {
      loadCollections()
      setLoadOnce(false)
    }
  }, [loadOnce])

  useEffect(() => {
    const saveCollections = () => {
      window.backend.Collections.SaveCollections(
        JSON.stringify(collections, null, 2),
      )
    }

    // not confirming if modified
    // will loop around this function
    // and will crash the app
    // I don't know why this works though, .. hmmm
    if (modified) {
      saveCollections()

      setSaved(true)
      setModified(false)
    }
  }, [collections, modified])

  return (
    <>
      <div>
        <div className="bg-white py-3">
          <header className="d-flex justify-content-between align-items-center">
            <h1 className="display-5">zeta</h1>
            <Button onClick={showModal}>Create New Collection</Button>
          </header>
        </div>

        <hr />

        <Container>
          {/* map collections */}
          <div>
            <Row md={2}>
              {collections
                .map((collection) => (
                  <Col key={collection.id}>
                    <div
                      className={`bg-${collection.type} p-4 rounded-lg mb-4`}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="w-75">
                          <h3 className="display-6 text-truncate">
                            {collection.name}
                          </h3>
                          <p className="lead pl-2 text-truncate">
                            {collection.description}
                          </p>
                          <p className="text-white font-weight-light">
                            {collection.type}
                          </p>
                        </div>
                        <div className="w-25 ml-2 d-flex align-items-center flex-column">
                          <Form>
                            <Button
                              variant="light"
                              size="lg"
                              className="my-1"
                              type="submit"
                              onClick={handleModal}
                            >
                              View
                            </Button>
                          </Form>
                          <Button
                            variant="success"
                            size="sm"
                            className="my-1"
                            onClick={() => handleUpdateCollection(collection)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="my-1"
                            onClick={() =>
                              handleRemoveCollection(collection, true)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
                .reverse()}
            </Row>
          </div>

          <Modal
            isOpen={rmodal}
            onRequestClose={() => setRModal(false)}
            contentLabel="Example Modal"
          >
            <div>I am a modal</div>
            <form>
              <input />
              <button>tab navigation</button>
              <button>stays</button>
              <button>inside</button>
              <button>the modal</button>
            </form>
          </Modal>

          <ColModal
            show={modal}
            onHide={closeModal}
            size="lg"
            backdrop="static"
            animation={false}
            keyboard={false}
          >
            <ColModal.Header closeButton>
              {update ? (
                <ColModal.Title>
                  Update{' '}
                  <span className="font-weight-bold">'{upItem.name}'</span>
                </ColModal.Title>
              ) : (
                <ColModal.Title>Create New Collection</ColModal.Title>
              )}
            </ColModal.Header>
            <Form onSubmit={submitForm}>
              <ColModal.Body>
                <Alert
                  show={alert}
                  variant="warning"
                  className="mb-2"
                  transition={null}
                >
                  {alertMessage}
                </Alert>
                <div className="w-75 mx-auto">
                  <Form.Group controlId="collection-name">
                    <Form.Label>
                      What should be your Collection Name?
                    </Form.Label>
                    <Form.Control
                      required
                      size="lg"
                      type="text"
                      defaultValue={update ? `${upItem.name}` : null}
                      placeholder="My Amazing Collection"
                      // onChange={(e) => setColName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="collection-description">
                    <Form.Label>Add a short description...</Form.Label>
                    <Form.Control
                      required
                      size="lg"
                      type="text"
                      defaultValue={update ? `${upItem.description}` : null}
                      placeholder="A short description"
                      // onChange={(e) => setColDesc(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="collection-type">
                    <Form.Label>
                      Select the type of your collection...
                    </Form.Label>
                    <Form.Control
                      defaultValue={update ? `${upItem.type}` : -1}
                      required
                      size="lg"
                      as="select"
                      // onChange={(e) => setColType(e.target.value)}
                    >
                      <option disabled value={-1} key={-1}>
                        Collection Type
                      </option>
                      <option value="movies">Movies</option>
                      <option value="series">Series</option>
                      <option value="anime">Anime</option>
                      <option value="books">Books</option>
                      <option value="manga">Manga</option>
                      <option value="asian_drama">Asian Drama</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </ColModal.Body>
              <ColModal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                {update ? (
                  <Button variant="primary" type="submit">
                    Update Collection
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Create Collection
                  </Button>
                )}
              </ColModal.Footer>
            </Form>
          </ColModal>
        </Container>
      </div>
    </>
  )
}
