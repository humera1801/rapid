import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import VendorTicketPayment from './VenodorTicketPayment';

interface VendorPaymentModelProps {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;




    
}

const VendorPaymentModel: React.FC<VendorPaymentModelProps> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Make Payment</Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <VendorTicketPayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}  />

            </Modal.Body>
            
        </Modal>
    );
};

export default VendorPaymentModel;
