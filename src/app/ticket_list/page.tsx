"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import "../ticket_list/custom.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import GetTicket from '../Api/GetTicket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from '@/components/Dashboard/Header';
import { exportToExcel } from './Ticket_data/exportToexcel';
import { exportToPDF } from './Ticket_data/PdfTicketList';
// import handlePrint from './Ticket_data/PrintPdfTicket';
import handlePrint from './Ticket_data/printUtils';
import { handleticketPDF } from './handleticketPdF';
// import { handlePrintData } from './Ticket_data/Print.js'


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
    print_final_total_amount: any;
    final_total_amount: any;
    added_by_name: string;
    name: string;
    mobile_no: string;
    cmp_mobile: string;
    bus_type: string;
    bus_name: string;
    payment_method: string;
    bus_no: string;
    st_no: string;
    sI_no: string;
    ticket_actual_total: number;
    boarding: string;
    rep_time: string;
    remarks: string;
    slr: number;
    st: number;
    ex: number;
    cmp_name: string;
    ex_rate: number;
    slr_rate: number;
    st_rate: number;
    paid_amount: number;
    remaining_amount: number;
    mobile: string;
}

const customStyle = {
    headRow: {
        style: {
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            fontWeight: 'bold',
            fontSize: '14px',
        }
    },
    headCells: {
        style: {
            fontSize: '18px',
            fontWeight: '600',
       
        }
    },
    cells: {
        style: {
            fontSize: '16px',
        }
    }
}

const Page: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Receipt No", "Customer Name", "From", "To", "Booking Date", "Journey Date",
        "Amount", "Print Amount", "Mobile-no", "Added By", "Action"
    ]);
    const [columnsOptions, setColumnsOptions] = useState<string[]>([
        "Receipt No", "Customer Name", "From", "To", "Booking Date", "Journey Date",
        "Amount", "Print Amount", "Mobile-no", "Added By", "Action"
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await GetTicket.getTicketBookData();
                console.log('GetTicket.getTicketBookData', res);
                setRecords(res.data);
            } catch (error) {
                console.log('Err', error);
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
            const response = await axios.post(`http://localhost:3000/ticket/remove_ticket_data`, formData);
            console.log('Ticket deleted successfully:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const handlePrintClick = (row: User) => {
        handlePrint(row);
    };

    const handleShare = (row: User) => {
        handleticketPDF(row);
    };

    const handleGeneratePDF = () => {
        exportToPDF(records)
    };

    const handleExcelExport = () => {
        exportToExcel(records);
    };

    const handleCopy = (): void => {
        if (columns.length === 0) return; 

        const header = columns.map(col => col.name).join(',') + '\n';
        const rows = records.map(record =>
            columns.map(col => {
                const cell = col.selector ? col.selector(record) : '';
                return typeof cell === 'string' ? cell : '';
            }).join(',')
        ).join('\n');

        const csvContent = header + rows;

        navigator.clipboard.writeText(csvContent)
            .then(() => {
                console.log('Data copied to clipboard');
                alert('Data copied to clipboard');
            })
            .catch(err => {
                console.error('Error copying data:', err);
            });
    };

    

    const handleColumnVisibilityChange = (column: string, isChecked: boolean) => {
        setVisibleColumns(prevState => 
            isChecked ? [...prevState, column] : prevState.filter(col => col !== column)
        );
    };

    const columns: TableColumn<User>[] = [
        {
            name: "Receipt No",
            selector: (row: User) => row.tkt_no,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap'
            },
            omit: !visibleColumns.includes("Receipt No")
        },
        {
            name: "Customer Name",
            selector: (row: User) => row.name,
            sortable: true,
            omit: !visibleColumns.includes("Customer Name")
        },
        {
            name: "From",
            selector: (row: User) => `${row.from_state_name}, ${row.from_city_name}`,
            sortable: true,
            omit: !visibleColumns.includes("From")
        },
        {
            name: "To",
            selector: (row: User) => `${row.to_state_name}, ${row.to_city_name}`,
            sortable: true,
            omit: !visibleColumns.includes("To")
        },
        {
            name: "Booking Date",
            selector: (row: User) => row.bdate,
            sortable: true,
            omit: !visibleColumns.includes("Booking Date")
        },
        {
            name: "Journey Date",
            selector: (row: User) => row.jdate,
            sortable: true,
            omit: !visibleColumns.includes("Journey Date")
        },
        {
            name: "Amount",
            selector: (row: User) => row.final_total_amount,
            sortable: true,
            omit: !visibleColumns.includes("Amount")
        },
        {
            name: "Print Amount",
            selector: (row: User) => row.print_final_total_amount,
            sortable: true,
            omit: !visibleColumns.includes("Print Amount")
        },
        {
            name: "Mobile-no",
            selector: (row: User) => row.mobile,
            sortable: true,
            style: {
                display: "none"
            },
            omit: !visibleColumns.includes("Mobile-no")
        },
        {
            name: "Added By",
            selector: (row: User) => row.added_by_name,
            sortable: true,
            omit: !visibleColumns.includes("Added By")
        },
        {
            name: "Action",
            style: {
                minWidth: '150px', // Adjust as needed
                display: 'flex',
                alignItems: 'center' // Center content vertically if needed
            },
            cell: (row: User) => (
                <div className='designbtn'>
                    <button className="btn btn-sm btn-success" style={{ color: '#ffffff' }} onClick={() => handleShare(row)} >Share</button>&nbsp;&nbsp;
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
            ),
            omit: !visibleColumns.includes("Action")
        }
    ];

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
                            <button className="pdf-button" onClick={handleGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleExcelExport}>Excel</button>
                            <button className="copy-button" onClick={handleCopy}>Copy</button>
                            <button className="copy-button" onClick={() => document.getElementById('column-visibility-menu')?.classList.toggle('show')}>
                                Column visibility
                            </button>
                        </div>
                        <div id="column-visibility-menu" className="column-visibility-menu">
                            {columnsOptions.map(option => (
                                <div key={option}>
                                    <input 
                                        type="checkbox" 
                                        id={option} 
                                        checked={visibleColumns.includes(option)} 
                                        onChange={(e) => handleColumnVisibilityChange(option, e.target.checked)} 
                                    />
                                    <label htmlFor={option}>{option}</label>
                                </div>
                            ))}
                        </div>
                        <div className='search'>
                            <label>Search&nbsp;</label>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => {/* Handle filter */}}
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
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 50]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;

