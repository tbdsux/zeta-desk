import React from 'react'
import { Col, Button, Form } from 'react-bootstrap'

export default function MapCol(props) {
  const collection = props.collection

  return (
    <Col>
      <div className={`bg-${collection.type} p-4 rounded-lg mb-4`}>
        <div className="d-flex align-items-center justify-content-center">
          <div className="w-75">
            <h3 className="display-6 text-truncate">{collection.name}</h3>
            <p className="lead pl-2 text-truncate">{collection.description}</p>
            <p className="text-white font-weight-light">{collection.type}</p>
          </div>
          <div className="w-25 ml-2 d-flex align-items-center flex-column">
            <Button
              variant="light"
              size="lg"
              className="my-1"
              type="submit"
              onClick={() => props.handleModal(collection)}
            >
              View
            </Button>
            <Button
              variant="success"
              size="sm"
              className="my-1"
              onClick={() => props.handleUpdateCollection(collection)}
            >
              Update
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="my-1"
              onClick={() => props.handleRemoveCollection(collection, true)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Col>
  )
}
