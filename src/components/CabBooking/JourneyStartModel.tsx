import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import JourneyStart from './JourneyStart'; // Adjust the path as needed

interface JourneyStartModalProps {
    show: boolean;
    handleClose: () => void;
    initialData?: any;
    StartId: number | null;



    
}

const JourneyStartModal: React.FC<JourneyStartModalProps> = ({ show, handleClose,initialData,StartId  }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Journey Start</Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <JourneyStart initialData={initialData} StartId={StartId}  />

            </Modal.Body>
            
        </Modal>
    );
};

export default JourneyStartModal;
