import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FireVendorPayment from './FireVendorpay';


interface FireVendorPayModelProps {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;




    
}

const FireVendorPayModel: React.FC<FireVendorPayModelProps> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title> Make  a Payment
            </Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <FireVendorPayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}  />

            </Modal.Body>
            
        </Modal>
    );
};

export default FireVendorPayModel;
