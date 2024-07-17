import React from 'react'
import { Button, Container, Modal } from 'react-bootstrap'

const EditBrand = (props:any) => {
    return (
        <>




            <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Brand
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form >
                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="brand_name" >Brand Name</label>
                                <input
                                  
                                    className="form-control"
                                    type='text'
                                    id='brand_name'
                                    required
                                />
                            </div>
                        </div>
                        <Modal.Footer>
                            <Button type='submit'>Add</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>






        </>
    )
}

export default EditBrand