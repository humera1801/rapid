"use client";
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import JourneyEnd from './journeyEnd';
import  "../CabBooking/model.css"


interface JourneryEndProps {
    show: boolean;
    handleClose: () => void;
    endinitialData?: any;
    EndId: number | null;


}

const JourneyEndModal: React.FC<JourneryEndProps> = ({ show, handleClose,endinitialData,EndId }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            // dialogClassName="modal-custom-size" 
            size="lg"

        >
            <Modal.Header closeButton>
                <Modal.Title>Journey End</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <JourneyEnd endinitialData={endinitialData} EndId={EndId}/>
            </Modal.Body>
           
        </Modal>
    );
};

export default JourneyEndModal;
