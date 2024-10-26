"use client";
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import "../CabBooking/model.css"
import QuotationApproved from './QuotationApproved';


interface Quotation {
    show: boolean;
    handleClose: () => void;
    QuotationData?: any;
    QuotationId: number | null;


}

const QuotationModel: React.FC<Quotation> = ({ show, handleClose, QuotationData, QuotationId }) => {
    return (
        <Modal
            size="lg"
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Approved</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <QuotationApproved QuotationData={QuotationData} QuotationId={QuotationId} />
            </Modal.Body>
        
        </Modal>
    );
};

export default QuotationModel;
