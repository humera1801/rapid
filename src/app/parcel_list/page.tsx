"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import "../ticket_list/custom.css"

import GetTicket from '../Api/GetTicket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faPlaneCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditTicketData from '../Api/EditTicketData';
import Link from 'next/link';
import GetParcelList from '../Api/GetParcelList';
import Header from '@/components/Dashboard/Header';
import handleParcelPrint from './parcel_data/printpparcelUtils';
import EditParcelDataList from '../Api/EditParcelDataList';
import {handleparcelPDF} from "../parcel_list/parcel_data/handleparcelPDF.js"


export interface User {
    id: string;
    token: any;
    receipt_no: string;
    from_state_name: string;
    to_state_name: string;
    from_city_name: string;
    to_city_name: string;
    sender_name: string;
    rec_name: string;
    dispatch_date: string;
    added_by_name: string;
    booking_date: string;
    payment_method: string;
    send_add: string;
    send_mob: string;
    rec_add: string;
    rec_mob: string;
    particulars: string;
    sender_proof_type: string;
    reciver_proof_type: string;
    sender_proof_detail: string;
    reciver_proof_detail: string
    pic_charge: number;
    dis_charge: number;
    total_print_rate: string;
    actual_total: string;
    print_total: string;
    gst_amount: string;
    print_gst_amount: string;
    bilty_charge: number;
    is_demurrage: boolean;
    actual_payable_amount: number;
    print_payable_amount: number;
    lr_no: number
    print_paid_amount: number;
    actual_bal_amount: number;
    print_bal_amount: number;
    total_demurrage_charges: number;
    demurrage_days: number;
    demurrage_charges: number;
    bill_detail: { e_way_bill_no: string; p_o_no: string; invoice_no: string; invoice_amount: string }[];
    parcel_detail: {
        parcel_type: string;
        weight: number;
        qty: number;
        rate: number;
        total_amount: number;
        print_rate: number;
        total_print_rate: number;
        QTYtotal: number;
    }[];


}

const customStyle = {
    headRow: {
        style: {
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif', // Example font family
            color: '#333', // Example color
            fontWeight: 'bold',
            fontSize: '14px',






        }
    },

    headCells: {
        style: {
            fontSize: '18px',
            fontWeight: '600',
            textTranForm: 'uppercase'


        }
    },

    cells: {
        style: {
            fontSize: '16px',
            wordbreak: "break-all",

        }
    }
}

const page = () => {




    const [editTicketId, setEditTicketId] = useState<string>('');

    // Function to handle click on Edit button
    const handleEditClick = (ticketId: string) => {
        setEditTicketId(ticketId);
    };

    const [records, setRecords] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            try {
                GetParcelList.getParcelBookData().then((res: any) => {
                    console.log('GetParcelList.getParcelBookData', res);
                    setRecords(res.data);

                }).catch((e: any) => {
                    console.log('Err', e);

                })
            } catch (error) {

            }

        };
        fetchData();
    }, []);



    const handleDeleteTicket = async (ticketId: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        console.log("id", ticketId);
        const formData = {
            parcel_id: ticketId
        }

        try {
            // Make a POST request to the API endpoint with the ticket ID in the request body
            const response = await axios.post(`http://localhost:3000/parcel/remove_parcel_detail_data`, formData);
            console.log('Ticket deleted successfully:', response.data);

            // Reload the page after successful deletion
            window.location.reload();

        } catch (error) {
            console.error('Error deleting ticket:', error);
            // Handle errors
        }
    };

    // const handlePrintClick = (row: User) => {
       
    // };


    const handlePrintClick = async (ticketToken: string) => {
        try {         
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);    
             console.log("Fetched details:", getTDetail.data[0]);            
            handleParcelPrint(getTDetail.data[0]);                  
            } catch (error) {
            console.error("Error fetching ticket data:", error);
            // Optionally show a user-friendly error message
        }
    };
    


    const handleShareClick = async (ticketToken: string) => {
        try {         
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);    
             console.log("Fetched details:", getTDetail.data[0]);          
            handleparcelPDF(getTDetail.data[0])               
        } catch (error) {
            console.error("Error fetching ticket data:", error);
            // Optionally show a user-friendly error message
        }
    };
    




    const columns = [
        {
            name: "Receipt No",
            selector: (row: User) => row.receipt_no,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap  !important'

            }

        },
        {
            name: "Booking Date",
            selector: (row: User) => row.booking_date,
            sortable: true,

        },
        {
            name: " From",
            selector: (row: User) => `${row.from_state_name}, ${row.from_city_name}`,

            sortable: true,

        },
        {
            name: " To",
            selector: (row: User) => `${row.to_state_name}, ${row.to_city_name}`,
            sortable: true
        },
        {
            name: "Sender Name",
            selector: (row: User) => row.sender_name,
            sortable: true
        },
        {
            name: "Reciver Name",
            selector: (row: User) => row.rec_name,
            sortable: true
        },
        {
            name: "Date",
            selector: (row: User) => row.dispatch_date,
            sortable: true,

        },

        {
            name: "Added By",
            selector: (row: User) => row.added_by_name,
            sortable: true,

        },
        {
            name: "Action",
            style: {
                minWidth: '100px', // Set width for "Action" column
            },
            cell: (row: User) => (
                <div className='designbtn'>
                    <button className="btn btn-sm btn-success" style={{ color: '#ffffff' }} onClick={() => handleShareClick(row.token)}>Share</button>&nbsp;&nbsp;
                    <button className="btn btn-sm btn-info" style={{ color: '#ffffff' }} onClick={() => handlePrintClick(row.token)}>Print</button>&nbsp;&nbsp;
                    <Link href={`parcel_list/parcel_data?token=${row.token}`} className="btn btn-sm btn-warning" style={{ color: '#ffffff' }}>

                        <FontAwesomeIcon icon={faEye} />
                    </Link>&nbsp;
                    <Link href={`parcel_list/Edit?token=${row.token}`} className="btn btn-sm btn-primary">

                        <FontAwesomeIcon icon={faPencilSquare} />
                    </Link>

                    <button onClick={(e) => handleDeleteTicket(row.id, e)} className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                        <FontAwesomeIcon icon={faTrash} />

                    </button>
                </div>

            )

        }

    ];

    const handleFilter = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const searchTerm = event.target.value.toLowerCase();
        const newData = records.filter((row: User) => {
            return (
                row.receipt_no.toLowerCase().includes(searchTerm) ||
                row.booking_date.toLowerCase().includes(searchTerm) ||
                row.dispatch_date.toLowerCase().includes(searchTerm) ||
                row.from_state_name.toLowerCase().includes(searchTerm) ||
                row.to_state_name.toLowerCase().includes(searchTerm) ||
                row.from_city_name.toLowerCase().includes(searchTerm) ||
                row.to_city_name.toLowerCase().includes(searchTerm) ||
                row.sender_name.toLowerCase().includes(searchTerm) ||
                row.rec_name.toLowerCase().includes(searchTerm) ||
                row.added_by_name.toLowerCase().includes(searchTerm)
            );
        });
        setRecords(newData);
    };


    const handleAction = (row: User) => {
        // Implement your action logic here
        console.log("Performing action for row:", row);
    };








    return (
        <>



            <Header />
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>
                    <div className="card-header">
                        <h4>Parcel Booking List</h4>
                    </div>


                    <div className='table table-striped new-table'>
                        <DataTable
                            columns={columns}
                            data={records}
                            customStyles={customStyle}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 50]}
                        // paginationTotalRows={records.length}
                        />

                    </div>
                </div>
            </div>















        </>
    )
}

export default page