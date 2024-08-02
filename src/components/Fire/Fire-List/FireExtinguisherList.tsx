// components/DataTable.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
// import "../../ticket_list/custom.css"
import "../../../app/ticket_list/custom.css"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faPlaneCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from '@/components/Dashboard/Header';
import getListFireData from '@/app/Api/FireApis/FireExtinghsherList/getListFireData';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import {FirePdf} from "../Fire-List/FirePdf.js"
import { handleFireDataPrint } from "./printFireUtills.js"



export interface User {
    febking_id: any;
    febking_created_by: any;
    fest_id: any;
    febking_final_amount: string;
    client_firstName: string;
    client_address: string;
    email: string;
    gstNo: string;
    client_mobileNo: string;
    vendorCode: string;
    invNo: string;
    certificateNo: string;
    poNo: string;
    febking_total_sgst: any;
    febking_total_cgst: any;
    febking_entry_type: 1;   
    febking_total_amount: string;
    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;   
    mobileNo: string;    
    client_id: any,   
    fest_name:string
    febking_invoice_no:string;
    product_data: {
        feit_hsn_code: any;
        qty: any;
        rate: any;
        totalAmount: any;
        hsnCode: string;
        capacity: string;
        feit_id: any;
        febd_sgst: any;
        feb_name:any;
        feit_name:any;
        febd_cgst: any;
        febd_sgst_amount: any;
        febd_cgst_amount: any;
        feb_id: string;
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

const FireExtinguisherList: React.FC = () => {


    const [records, setRecords] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            try {
                getListFireData.getFireListData().then((res: any) => {
                    console.log(' getListFireData.getFireListData', res);

                    setRecords(res);
                    console.log("data", res)

                }).catch((e: any) => {
                    console.log('Err', e);

                })
            } catch (error) {

            }

        };
        fetchData();
    }, []);

    // const handleDeleteTicket = async (ticketId: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     e.preventDefault();

    //     console.log("id", ticketId);
    //     const formData = {
    //         ticket_id: ticketId
    //     }

    //     try {
    //         // Make a POST request to the API endpoint with the ticket ID in the request body
    //         const response = await axios.post(`http://localhost:3000/ticket/remove_ticket_data`, formData);
    //         console.log('Ticket deleted successfully:', response.data);

    //         // Reload the page after successful deletion
    //         window.location.reload();

    //     } catch (error) {
    //         console.error('Error deleting ticket:', error);
    //         // Handle errors
    //     }
    // };

    // const handleDeleteTicket = async (ticketId: string) => {
    //     console.log("id",ticketId);
    //     const formData ={
    //         ticket_id: ticketId
    //     }

    //     try {
    //         // Make a POST request to the API endpoint with the ticket ID in the request body
    //         const response = await axios.post(`http://localhost:3000/ticket/remove_ticket_data`,formData);
    //         console.log('Ticket deleted successfully:', response.data);
    //         // Optionally, you can perform additional actions upon successful deletion, such as updating the UI.
    //         // For example, you can fetch the updated list of tickets.

    //     } catch (error) {
    //         console.error('Error deleting ticket:', error);
    //         // Handle errors
    //     }
    // };


    // const handleTicketView = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     event.preventDefault();
    //     try {
    //         GetTicket.getTicketBookData().then((res: any) => {
    //             console.log('GetTicket.getTicketBookData', res);
    //             setRecords(res.data);

    //         }).catch((e: any) => {
    //             console.log('Err', e);

    //         })
    //     } catch (error) {

    //     }
    // }



    // const handlePrintClick = (row: User) => {
    //     handlePrint(row); // Call the imported handlePrint function
    // };




    const handleFirePrintClick = async (febking_id: string) => {
        try {         
            const getTDetail = await getFireBookingId.GetFireBookingId(febking_id);    
             console.log("Fetched details:", getTDetail.data[0]);          
            //  handleFirePrint( getTDetail.data[0]);
        handleFireDataPrint( getTDetail.data[0]);
            } catch (error) {
            console.error("Error fetching ticket data:", error);
            // Optionally show a user-friendly error message
        }
    };

    const handleFireShareClick = async (febking_id: string) => {
        try {         
            const getTDetail = await getFireBookingId.GetFireBookingId(febking_id);    
             console.log("Fetched details:", getTDetail.data[0]);          

             FirePdf( getTDetail.data[0]);
            } catch (error) {
            console.error("Error fetching ticket data:", error);
            // Optionally show a user-friendly error message
        }
    };











    const columns = [
        {
            name: "Name",
            selector: (row: User) => row.client_firstName,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap  !important'

            }

        },
        {
            name: "Address",
            selector: (row: User) => row.client_address,
            sortable: true
        },
        {
            name: "Mobile No",
            selector: (row: User) => row.client_mobileNo,
            sortable: true
        },
        {
            name: "Actual Total",
            selector: (row: User) => row.febking_final_amount,
            sortable: true
        },
        // {
        //     name: "Amount",
        //     selector: (row: User) => row.final_total_amount,
        //     sortable: true,

        // },
        // {
        //     name: "Print Amount",
        //     selector: (row: User) => row.print_final_total_amount,
        //     sortable: true,

        // },
        // {
        //     name: "Added By",
        //     selector: (row: User) => row.added_by_name,
        //     sortable: true,

        // },

        {
            name: "Action",
            style: {
                minWidth: '100px', // Set width for "Action" column
            },
            cell: (row: User) => (
                <div className='designbtn'>
                    <button className="btn btn-sm btn-success" style={{ color: '#ffffff' }} onClick={() => handleFireShareClick(row.febking_id)}>Share</button>&nbsp;&nbsp;
                    <button className="btn btn-sm btn-info" style={{ color: '#ffffff' }}  onClick={() => handleFirePrintClick(row.febking_id)} >Print</button>&nbsp;&nbsp;
                    <Link href={`Fire-List/FireView?id=${row.febking_id}`}    className="btn btn-sm btn-warning" style={{ color: '#ffffff' }}>

                        <FontAwesomeIcon icon={faEye} />
                    </Link>&nbsp;
                    <Link href={`Fire-List/Edit?id=${row.febking_id}`} className="btn btn-sm btn-primary">

                        <FontAwesomeIcon icon={faPencilSquare} />
                    </Link>

                    <Link href={""}  className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                        <FontAwesomeIcon icon={faTrash} />

                    </Link>
                </div>

            )

        }

    ];



    const generatePDF = () => {
        const input = document.getElementById('pdf-content') as HTMLElement;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('ticket_list.pdf');
        });
    };


    // const handleFilter = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //     const searchTerm = event.target.value.toLowerCase();
    //     const newData = records.filter((row: User) => {
    //         return (
    //             row.tkt_no.toLowerCase().includes(searchTerm) ||
    //             row.name.toLowerCase().includes(searchTerm) ||
    //             row.final_total_amount.toLowerCase().includes(searchTerm) ||
    //             row.from_state_name.toLowerCase().includes(searchTerm) ||
    //             row.to_state_name.toLowerCase().includes(searchTerm) ||
    //             row.from_city_name.toLowerCase().includes(searchTerm) ||
    //             row.to_city_name.toLowerCase().includes(searchTerm) ||
    //             row.bdate.toLowerCase().includes(searchTerm) ||
    //             row.jdate.toLowerCase().includes(searchTerm) ||
    //             row.added_by_name.toLowerCase().includes(searchTerm)
    //         );
    //     });
    //     setRecords(newData);
    // };


    const handleFilter = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const searchTerm = event.target.value.toLowerCase();
        const newData = records.filter((row: User) =>
            Object.values(row).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm)
            )
        );
        setRecords(newData);
    };


    // const handleAction = (row: User) => {
    //     // Implement your action logic here
    //     console.log("Performing action for row:", row);
    // };
    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>
                    <div className="card-header">
                        <h4>Fire Extinguisher  List</h4>
                    </div>
                    <div className="table-options">



                    </div>

                    <div id="pdf-content" className='table table-striped new-table'>
                        <DataTable
                            columns={columns}
                            data={records}
                            customStyles={customStyle}
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 20, 50]}
                        />
                    </div>

                </div>
            </div>
        </>
    );
}

export default FireExtinguisherList;
