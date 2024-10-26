"use client";
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import JourneyEnd from './journeyEnd';
import "../CabBooking/model.css"
import JourneyPayment from './JourneyPayment';


interface JpurneyPayment {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;


}

const JourneyPaymentModel: React.FC<JpurneyPayment> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal
            size="lg"
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Receive Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <JourneyPayment paymentinitialData={paymentinitialData} PaymentId={PaymentId} />
            </Modal.Body>
        
        </Modal>
    );
};

export default JourneyPaymentModel;
