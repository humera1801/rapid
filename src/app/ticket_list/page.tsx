"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import "../ticket_list/custom.css"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import GetTicket from '../Api/GetTicket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faPlaneCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from '@/components/Dashboard/Header';
import handlePrint from './Ticket_data/printUtils';

export interface User {
    id: string;
    token: number;
    tkt_no: string;
    from_state_name: string;
    to_state_name: string;
    from_city_name: string;
    to_city_name: string;
    bdate: string;
    jdate: string;
    print_final_total_amount: string;
    final_total_amount: string;
    added_by_name: string;
    name: string;
    mobile_no: string;
    cmp_mobile: string;
    bus_type: string,
    bus_name: string;
    payment_method: string;
    bus_no: string;
    st_no: string;
    sI_no: string;
    ticket_actual_total: number;
    boarding: string;
    rep_time: string;
    remarks: string;
    cmp_name: string;

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

const Page: React.FC = () => {


    const [records, setRecords] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            try {
                GetTicket.getTicketBookData().then((res: any) => {
                    console.log('GetTicket.getTicketBookData', res);
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
            ticket_id: ticketId
        }

        try {
            // Make a POST request to the API endpoint with the ticket ID in the request body
            const response = await axios.post(`http://localhost:3000/ticket/remove_ticket_data`, formData);
            console.log('Ticket deleted successfully:', response.data);

            // Reload the page after successful deletion
            window.location.reload();

        } catch (error) {
            console.error('Error deleting ticket:', error);
            // Handle errors
        }
    };

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



    const handlePrintClick = (row: User) => {
        handlePrint(row); // Call the imported handlePrint function
    };

    const columns = [
        {
            name: "Receipt No",
            selector: (row: User) => row.tkt_no,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap  !important'

            }

        },
        {
            name: "Customer Name",
            selector: (row: User) => row.name,
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
            name: "Booking Date",
            selector: (row: User) => row.bdate,
            sortable: true
        },
        {
            name: "Journey Date",
            selector: (row: User) => row.jdate,
            sortable: true
        },
        {
            name: "Amount",
            selector: (row: User) => row.final_total_amount,
            sortable: true,

        },
        {
            name: "Print Amount",
            selector: (row: User) => row.print_final_total_amount,
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
                    <button className="btn btn-sm btn-success" style={{ color: '#ffffff' }}>Share</button>&nbsp;&nbsp;
                    <button className="btn btn-sm btn-info" style={{ color: '#ffffff' }} onClick={() => handlePrintClick(row)} >Print</button>&nbsp;&nbsp;
                    <Link href={`ticket_list/Ticket_data?token=${row.token}`} className="btn btn-sm btn-warning" style={{ color: '#ffffff' }}>

                        <FontAwesomeIcon icon={faEye} />
                    </Link>&nbsp;
                    <Link href={`ticket_list/Edit?token=${row.token}`} className="btn btn-sm btn-primary">

                        <FontAwesomeIcon icon={faPencilSquare} />
                    </Link>

                    <button onClick={(e) => handleDeleteTicket(row.id, e)} className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                        <FontAwesomeIcon icon={faTrash} />

                    </button>
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
                        <h4>Ticket Booking List</h4>
                    </div>
                    <div className="table-options">
                        <div className="entries-selector">
                            <label htmlFor="entries">Show </label>
                            <select id="entries" >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>entries</span>
                        </div>
                        <div className="action-buttons">
                        <button className="pdf-button" onClick={generatePDF}>PDF</button>
                        <button className="excel-button">Excel</button>
                            <button className="copy-button">Copy</button>
                            <button className="copy-button">
                                Column visibility
                            </button>

                        </div>
                        <div className='search'>
                            <label>Search&nbsp;</label>
                            <input
                                type="text"
                                placeholder="Search..."

                                onChange={handleFilter}
                                className="search-input"
                            />
                        </div>
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

export default Page;
