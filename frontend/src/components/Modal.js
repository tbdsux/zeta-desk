import React, { useState, useRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function CollectionModal(props) {
  const collection = props.collection

  const [addModal, setAddModal] = useState(false)
  const searchInput = useRef(null)

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
          <Modal.Title>Find and Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-75 mx-auto">
            <Form>
              <Form.Group controlId="collection-name">
                <Form.Label>Search the title of the item to add</Form.Label>
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
        </Modal.Body>
      </Modal>
    </>
  )
}
