"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import "../../app/ticket_list/custom.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CreateRole from '@/app/Api/RoleApi/CreateRole';
import EmployeeList from '@/app/Api/Employee/EmployeeList';
import getUserProfile from '@/app/Api/UserProfile';
import ClientListApi from '@/app/Api/ClientApi/ClientListApi';
import { exportTransactionListPDF } from './ClientPrint/TransactionPdf';
import { exportTransactionExcel } from './ClientPrint/TransactionExcel';
import { generateTransactionPrint } from './ClientPrint/TransactionPrint';
import { generatePaymentReceiptPdf } from './ClientPrint/TransactionPrintPdf';


interface User {
    id: any
    pay_id: any
    e_name: string;
    e_email: string;
    e_password: string;
    confirmPassword: string;
    e_mobile_no: string;
    e_address: string;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    total_amount: any;
    created_by_name: string;
    name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
}

const customStyle = {
    table: {
        style: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }
    },
    headRow: {
        style: {
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            fontWeight: 'bold',
            fontSize: '16px',
        }
    },
    headCells: {
        style: {
            fontSize: '16px',
            fontWeight: '600',
            padding: '12px',

        }
    },
    cells: {
        style: {
            fontSize: '15px',
            padding: '10px',
            borderBottom: '1px solid #ddd',
        }
    },
    rows: {
        style: {

            '&:hover': {
                backgroundColor: '#f1f1f1',
            },
        }
    },

    paginationButton: {
        style: {
            borderRadius: '4px',
            border: '1px solid #ddd',
            color: '#0275d8',
            fontSize: '14px',
            padding: '5px 10px',
            margin: '0 2px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
        },
        active: {
            style: {
                color: '#fff',
            }
        },
        disabled: {
            style: {
                color: '#6c757d',
                cursor: 'not-allowed',
            }
        }
    },
    footer: {
        style: {
            padding: '10px',
            borderTop: '1px solid #ddd',
        }
    }
};


const Transaction: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const storedData = localStorage.getItem('userData');






    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filterDate, setFilterDate] = useState<any>(null);

    const handleClick = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const client_id = urlParams.get("client_id");

        if (client_id && startDate && endDate) {
            await handlefilterdate(client_id, startDate, endDate);
        } else {
            alert('Please select both start and end dates, and ensure client_id is present.');
        }
    };

    const handlefilterdate = async (client_id: string, startdate: string, enddate: string) => {
        try {
            const start = new Date(startdate);
            const end = new Date(enddate);

            if (start > end) {
                alert('End date must be greater than start date');
                return;
            }

            const response = await ClientListApi.getTransactionFilterdate(client_id, startdate, enddate);
            setOriginalRecords(response.data);
            setRecords(response.data);
        } catch (error) {
            console.error('Error filtering transactions:', error);
        }
    };


    useEffect(() => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        lastMonth.setDate(1);
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        setStartDate(formatDate(lastMonth));
        setEndDate(formatDate(today));
    }, []);


    const getDateRange = () => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        return {
            startDate: formatDate(lastMonth),
            endDate: formatDate(today)
        };
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const client_id = urlParams.get("client_id");
                const { startDate, endDate } = getDateRange();
                if (client_id) {
                    const response = await ClientListApi.getTransactionFilterdate(client_id, startDate, endDate);
                    setRecords(response.data);

                    console.log("Payment Data:", response.data);
                } else {
                    console.error('Error fetching payment data:');

                }
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const client_id = urlParams.get("client_id");

            if (client_id) {
                getTicketDetail(client_id);
            }
            else {
                setRecords([])
            }
        };

        fetchData();
        window.addEventListener('popstate', handleURLChange);
        handleURLChange(); // Initial call on mount

        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);

    const getTicketDetail = async (client_id: string) => {
        try {
            const getTDetail = await ClientListApi.getTransactionFilterdate(client_id, startDate, endDate);
            setRecords(getTDetail.data);

            console.log("Payment Details:", getTDetail.data);
        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };




    const handleClearFilter = async () => {
        setStartDate('');
        setEndDate('');

        try {
            const data = await ClientListApi.getTransactionFilterdate(startDate, endDate);
            setRecords(data.data);
            console.log('All data fetched:', data.data);
        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };


    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleTodayList = async () => {
        const today = getTodayDate();

        try {
            const data = await ClientListApi.getTransactionFilterdate(today);
            setRecords(data.data);
            console.log('Filtered data for today:', data.data);
        } catch (error) {
            console.error('Error fetching filtered data for today:', error);
        }
    };



    const formatBookingType = (type: any) => {
        return type
            .split('_') 
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) 
            .join(' ');
    };



    const columns: TableColumn<User>[] = [
        {
            name: "No",
            cell: (row: User, index: number) => index + 1,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap',
            },
        },
        {
            name: "Booking Of",
            cell: (row: User) => {
                let link;
                const formattedBookingType = formatBookingType(row.booking_type); // Format the booking type

                switch (row.booking_type) {
                    case 'cab_booking':
                        link = `/CabBooking/ViewCab?id=${row.id}`;
                        break;
                    case 'fire_booking':
                        link = `/Fire/Fire-List/FireView?id=${row.id}`;
                        break;
                    case 'parcel_booking':
                        link = `/parcel_list/parcel_data?token=${row.id}`;
                        break;
                    case 'ticket_booking':
                        link = `/ticket_list/Ticket_data?id=${row.id}`;
                        break;
                    default:
                        return formattedBookingType; // Return formatted type
                }

                return (
                    <Link href={link} style={{ color: 'black', textDecoration: 'none' }}>
                        {formattedBookingType} {/* Use the formatted booking type here */}
                    </Link>
                );
            },
            sortable: true,
            style: {
             fontSize:"11px"
            },
        },

        {
            name: "Customer Name",
            selector: (row: User) => row.name,
            sortable: true,

        },
        {
            name: "Total Amount",
            selector: (row: User) => row.total_amount,
            sortable: true,
        },

        {
            name: "Paid Amount",
            selector: (row: User) => row.paid_amount,
            sortable: true,
        },

        {
            name: "payment method",
            selector: (row: User) => row.payment_method,
            sortable: true,
        },

        {
            name: "Payment Details",
            selector: (row: User) => row.payment_details,
            sortable: true,
        },



        {
            name: "Added By",
            selector: (row: User) => row.created_by_name,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row: User) => (
                <div className='action-buttons' style={{ fontSize: "10px" }}>
                    <>
                        <button style={{ fontSize: "10px" }} className="btn btn-sm btn-success" onClick={() => handleShareClick(row.receipt_no)}>
                            Share
                        </button>
                        <button style={{ fontSize: "10px" }} className="btn btn-sm btn-info" onClick={() => handleCabPrint(row.receipt_no)}>
                            Print
                        </button>

                    </>

                </div>
            ),
        },




    ];

    const handleCabPrint = async (receipt_no: string) => {
        try {
            const getTDetail = await ClientListApi.getTranSactionPrint(receipt_no);
            
            generateTransactionPrint(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };




    

    const handleShareClick = async (receipt_no: string) => {
        try {
            const getTDetail = await ClientListApi.getTranSactionPrint(receipt_no);
            
            (getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<User[]>([]); // Holds original data


    const handleFilter = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const newData = originalRecords.filter((row: User) =>
            Object.values(row).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm)
            )
        );

        setRecords(newData);
    };


    const handleGeneratePDF = () => {
        exportTransactionListPDF(records)
    };

    const handleTransactionExcelExport = () => {
        exportTransactionExcel(records);
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





    return (
        <>
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Client Transaction History</h4>
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <div className="d-flex flex-column">
                                    <label htmlFor="start-date" className="form-label mb-0 sdate">Start Date:</label>
                                    <input style={{ fontSize: "12px" }} type="date" id="start-date" name="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)} className="form-control" />
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <label htmlFor="end-date" className="form-label mb-0 edate">End Date:</label>
                                    <input style={{ fontSize: "12px" }} type="date" id="end-date" name="end-date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)} className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ marginTop: "22px" }}>
                                <button style={{ fontSize: "12px" }} onClick={handleClick} className="btn btn-primary btn-sm" >
                                    <FontAwesomeIcon icon={faFilter} />

                                </button>
                                <button style={{ fontSize: "12px" }} className="btn btn-success btn-sm" onClick={handleTodayList} >Today List</button>
                                <button style={{ fontSize: "12px" }} onClick={handleClearFilter} className="btn btn-danger btn-sm" >Clear Filter</button>
                            </div>
                        </div>
                    </div>
                    <div className="table-options">

                        <div className="action-buttons">
                            <button className="pdf-button" onClick={handleGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleTransactionExcelExport}>Excel</button>
                            <button className="copy-button" onClick={handleCopy}>Copy</button>
                        </div>

                        <div className='search'>
                            <label>Search&nbsp;</label>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={handleFilter}
                                className="search-input"
                                value={searchTerm}
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
                            keyField="pay_id" // Replace "id" with your actual unique identifier
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Transaction;
