import React from 'react'
import { Modal, Alert, Form, Button } from 'react-bootstrap'

export default function AddUpdateModalContent(props) {
  return (
    <>
      <Modal.Header closeButton>
        {props.update ? (
          <Modal.Title>
            Update{' '}
            <span className="font-weight-bold">'{props.upItem.name}'</span>
          </Modal.Title>
        ) : (
          <Modal.Title>Create New Collection</Modal.Title>
        )}
      </Modal.Header>
      <Form onSubmit={props.submitForm}>
        <Modal.Body>
          <Alert
            show={props.alert}
            variant="warning"
            className="mb-2"
            transition={null}
          >
            {props.alertMessage}
          </Alert>
          <div className="w-75 mx-auto">
            <Form.Group controlId="collection-name">
              <Form.Label>What should be your Collection Name?</Form.Label>
              <Form.Control
                ref={props.colName}
                required
                size="lg"
                type="text"
                defaultValue={props.update ? `${props.upItem.name}` : null}
                placeholder="My Amazing Collection"
                // onChange={(e) => setColName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="collection-description">
              <Form.Label>Add a short description...</Form.Label>
              <Form.Control
                ref={props.colDesc}
                required
                size="lg"
                type="text"
                defaultValue={
                  props.update ? `${props.upItem.description}` : null
                }
                placeholder="A short description"
                // onChange={(e) => setColDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="collection-type">
              <Form.Label>Select the type of your collection...</Form.Label>
              <Form.Control
                ref={props.colType}
                defaultValue={props.update ? `${props.upItem.type}` : -1}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.closeModal}>
            Close
          </Button>
          {props.update ? (
            <Button variant="primary" type="submit">
              Update Collection
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Create Collection
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </>
  )
}
