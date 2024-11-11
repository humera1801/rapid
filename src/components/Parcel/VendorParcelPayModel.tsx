import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PArcelPayment from './ParcelPayment';
import VendorParcelPayment from './VendorParcelPay';

interface VendorparcelModelProps {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;




    
}

const VendorparcelModel: React.FC<VendorparcelModelProps> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title> Make  a Payment
            </Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <VendorParcelPayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}  />

            </Modal.Body>
            
        </Modal>
    );
};

export default VendorparcelModel;
