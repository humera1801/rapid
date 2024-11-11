import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import CabVendorpayment from './CabVendorpay';


interface VendorCabModelProps {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;




    
}

const VendorCabModel: React.FC<VendorCabModelProps> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal   size="lg"  show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title> Make Payment
            </Modal.Title>

            </Modal.Header>
            <Modal.Body>
            <CabVendorpayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}  />

            </Modal.Body>
            
        </Modal>
    );
};

export default VendorCabModel;
