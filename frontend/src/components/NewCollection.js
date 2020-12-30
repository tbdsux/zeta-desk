import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal as ColModal, Row, Container } from 'react-bootstrap'

import MapCol from './collections/Map'
import AddUpdateModalContent from './collections/AddUpdate'
import CollectionsModal from './Modal'

import Modal from 'react-modal'
import * as Wails from '@wailsapp/runtime'

Modal.setAppElement("#app")

export default function NewCollection() {
  // reference form modal inputs
  const colName = useRef(null)
  const colDesc = useRef(null)
  const colType = useRef(null)

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

  const [viewCollection, setViewCollection] = useState({})

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

    //get form input values
    const name = colName.current.value
    const desc = colDesc.current.value
    const type = colType.current.value

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
  const handleModal = (collection) => {
    // open modal
    setRModal(true)

    // set the item to view
    setViewCollection(collection)
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
                  <MapCol
                    key={collection.id}
                    handleModal={handleModal}
                    collection={collection}
                    handleRemoveCollection={handleRemoveCollection}
                    handleUpdateCollection={handleUpdateCollection}
                  />
                ))
                .reverse()}
            </Row>
          </div>

          <Modal
            isOpen={rmodal}
            onRequestClose={() => {
              setRModal(false)
              setViewCollection({}) // remove the current item
            }}
          >
            <CollectionsModal collection={viewCollection} />
          </Modal>

          <ColModal
            show={modal}
            onHide={closeModal}
            size="lg"
            backdrop="static"
            animation={false}
            keyboard={false}
          >
            <AddUpdateModalContent
              update={update}
              upItem={upItem}
              submitForm={submitForm}
              alert={alert}
              alertMessage={alertMessage}
              colName={colName}
              colDesc={colDesc}
              colType={colType}
              closeModal={closeModal}
            />
          </ColModal>
        </Container>
      </div>
    </>
  )
}
