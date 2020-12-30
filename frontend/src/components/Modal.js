import React from 'react'
import { Modal } from 'react-bootstrap'

export default function CollectionModal(props) {
  const collection = props.collection

  return (
    <div>
      <Modal.Header>
        <div className="d-flex align-items-center">
          <Modal.Title>
            <h3 className="font-weight-bold text-primary">{collection.name}</h3>
          </Modal.Title>
          <span className="text-muted font-weight-bold ml-3">
            ({collection.type})
          </span>
        </div>
        <div>
          <p className="lead">{collection.description}</p>
        </div>
      </Modal.Header>
    </div>
  )
}
