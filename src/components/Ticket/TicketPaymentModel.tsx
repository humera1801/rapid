import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import TicketPayment from './TicketPayment';

interface TicketPaymentModelProps {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;




    
}

const TicketPaymentModel: React.FC<TicketPaymentModelProps> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title> Recieve Payment</Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <TicketPayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}  />

            </Modal.Body>
            
        </Modal>
    );
};

export default TicketPaymentModel;
