"use client";
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import "../CabBooking/model.css"
import JourneyPayment from '../CabBooking/JourneyPayment';
import FirePayment from './FirePayment';


interface JpurneyPayment {
    show: boolean;
    handleClose: () => void;
    paymentinitialData?: any;
    PaymentId: number | null;


}

const FirePaymentModel: React.FC<JpurneyPayment> = ({ show, handleClose, paymentinitialData, PaymentId }) => {
    return (
        <Modal
            size="lg"
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title> Recieve Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FirePayment paymentinitialData={paymentinitialData} PaymentId={PaymentId}/>
            </Modal.Body>
        
        </Modal>
    );
};

export default FirePaymentModel;
