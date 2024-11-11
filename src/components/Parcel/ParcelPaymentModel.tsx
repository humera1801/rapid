import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PArcelPayment from './ParcelPayment';

interface PArcelPaymentModelProps {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;




    
}

const PArcelPaymentModel: React.FC<PArcelPaymentModelProps> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title> Recieve Payment
            </Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <PArcelPayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}  />
            </Modal.Body>
            
        </Modal>
    );
};

export default PArcelPaymentModel;
