// components/DataTable.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/ticket_list/custom.css"
// import "../../../app/ticket_list/custom.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faPlaneCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


import Link from 'next/link';
import Header from '@/components/Dashboard/Header';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import { ShareQuotationPdf } from "../Quatation/QuatationPdf/ShareForm.js";
import { printQuotationPDF } from "../Quatation/QuatationPdf/PrintForm.js";
// import "../../../../public/css/style.css";
import { exportToQuotationListPDF } from '../Quatation/QuatationPdf/PdfQuotationList';
import { exportToQuotationExcel } from '../Quatation/QuatationPdf/ExcelQuotation';
import QuotationFilterList from '@/app/Api/FireApis/Quotation/QuotationFilterList';
import getUserProfile from '@/app/Api/UserProfile';

export interface User {
    q_id: any;
    client_email: any;
    febking_created_by: any;
    client_gstNo: any;
    fest_id: any;
    q_final_amount: string;
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
    client_id: any;
    created_by_name: any;
    fest_name: string;
    q_quotation_no: string;
    product_data: {
        feit_hsn_code: any;
        qty: any;
        rate: any;
        totalAmount: any;
        hsnCode: string;
        capacity: string;
        feit_id: any;
        febd_sgst: any;
        feb_name: any;
        feit_name: any;
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
            fontFamily: 'Arial, sans-serif',
            color: '#333',
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
};

const QuotationList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<User[]>([]); // Holds original data
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Quotation No", "Name", "State/City", "Address", "Mobile No", "Actual Total", "Added By", "Action"
    ]);

    const [userName, setUserName] = useState('');
    const [userRoles, setUserRoles] = useState<string[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const e_id = parseInt(storedData, 10);
            getUserProfile(e_id)
                .then((userData) => {
                    setUserName(userData.e_name);
                    return axios.post('http://192.168.0.106:3001/employee/get_role_employee', { e_id });
                })
                .then((roleResponse) => {
                    const rolesData = roleResponse.data.data;
                    if (rolesData && rolesData.length > 0) {
                        setUserRoles(rolesData[0].e_task);
                        console.log("role", rolesData[0].e_task);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch user profile or roles:', error);
                });
        }
    }, []);


    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleClick = async () => {
        if (startDate && endDate) {
            await handlefilterdate(startDate, endDate);
        } else {
            alert('Please select both start and end dates.');
        }
    };



    const getDateRange = () => {
        const today = new Date();
        const lastMonth = new Date();
        const TillDate = new Date(today);

        lastMonth.setMonth(today.getMonth() - 1);

        TillDate.setDate(today.getDate() + 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        return {
            startDate: formatDate(lastMonth),
            endDate: formatDate(TillDate),
        };
    };

    const fetchAllData = async () => {
        const { startDate, endDate } = getDateRange();

        try {
            const data = await QuotationFilterList.getquotationFilterdate(startDate, endDate);
            console.log(data.data);

            setRecords(data.data);
            setOriginalRecords(data.data)
        } catch (error) {
            console.error('Error fetching all data:', error);
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
        fetchAllData();
    }, []);







    const handlefilterdate = async (startdate: string, enddate: string) => {
        try {
            const start = new Date(startdate);
            const end = new Date(enddate);

            if (start > end) {
                alert('End date must be greater than start date');
                return;
            }

            if (start.getTime() === end.getTime()) {
                alert('Start date and end date cannot be the same');
                return;
            }

            const response = await QuotationFilterList.getquotationFilterdate(startdate, enddate);
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };




    const handleClearFilter = async () => {
        setStartDate('');
        setEndDate('');

        try {
            const data = await QuotationFilterList.getquotationFilterdate();
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
            const data = await QuotationFilterList.getquotationFilterdate(today);
            setRecords(data.data);
            console.log('Filtered data for today:', data.data);
        } catch (error) {
            console.error('Error fetching filtered data for today:', error);
        }
    };



    useEffect(() => {
        const newColumns = [
            visibleColumns.includes('Quotation No') && {
                name: "Quotation No",
                selector: (row: User) => row.q_quotation_no,
                sortable: true,
                cell: (row: any) => (
                    <Link
                        href={`ViewQuotation?id=${row.q_id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            backgroundColor: 'transparent',
                            padding: '5px',
                        }}
                    >
                        {row.q_quotation_no}
                    </Link>
                ),
                style: {
                    minWidth: '50px',
                    whiteSpace: 'nowrap',
                    fontSize: "12px"
                },
            },
            visibleColumns.includes('Name') && {
                name: "Name",
                selector: (row: User) => row.client_firstName,
                sortable: true,
                style: {
                    minWidth: '50px',
                    whiteSpace: 'nowrap !important',
                }
            },
            visibleColumns.includes('State/City') && {
                name: "State/City",
                selector: (row: User) => `${row.client_state}, ${row.client_city}`,
                sortable: true,
            },
            visibleColumns.includes('Address') && {
                name: "Address",
                selector: (row: User) => row.client_address,
                sortable: true,
            },
            visibleColumns.includes('Mobile No') && {
                name: "Mobile No",
                selector: (row: User) => row.client_mobileNo,
                sortable: true,
            },
            visibleColumns.includes('Actual Total') && {
                name: "Actual Total",
                selector: (row: User) => row.q_final_amount,
                sortable: true,
            },
            visibleColumns.includes('Added By') && {
                name: "Added By",
                selector: (row: User) => row.created_by_name,
                sortable: true,
            },
            visibleColumns.includes('Action') && {
                name: "Action",
                cell: (row: User) => (
                    <div className='action-buttons'>
                        <button className="btn btn-sm btn-success" style={{ fontSize: "10px" }} onClick={() => handleQuotationShareClick(row.q_id)}>Share</button>
                        <button className="btn btn-sm btn-info" style={{ fontSize: "10px" }} onClick={() => handleQuotationPrint(row.q_id)}>Print</button>
                        {userRoles.includes('fireQuotation_view') && (

                            <Link href={`ViewQuotation?id=${row.q_id}`} className="btn btn-sm btn-warning" >
                                <FontAwesomeIcon icon={faEye} />
                            </Link>
                        )}
                        {userRoles.includes('fireQuotation_update') && (

                            <Link href={`EditQuotation?id=${row.q_id}`} className="btn btn-sm btn-primary">
                                <FontAwesomeIcon icon={faPencilSquare} />
                            </Link>
                        )}
                        {userRoles.includes('fireQuotation_delete') && (

                            <Link href={""} className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Link>
                        )}
                    </div>
                ),
            },
        ].filter(Boolean);

        setColumns(newColumns);
    }, [visibleColumns, userRoles]);




    const handleQuotationPrint = async (q_id: string) => {
        try {
            const getTDetail = await QuotationFilterList.GetQuotationBookingId(q_id);
            printQuotationPDF(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

    const handleQuotationShareClick = async (q_id: string) => {
        try {
            const getTDetail = await QuotationFilterList.GetQuotationBookingId(q_id);
            ShareQuotationPdf(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

    const handleColumnVisibilityChange = (column: string, isVisible: boolean) => {
        setVisibleColumns(prevColumns => {
            if (isVisible) {
                return [...prevColumns, column];
            } else {
                return prevColumns.filter(col => col !== column);
            }
        });
    };

    const handleQuotaionListGeneratePDF = () => {
        exportToQuotationListPDF(records);
    };

    const handleFireExcelExport = () => {
        exportToQuotationExcel(records);
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






    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>

                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Quotation List</h4>
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <div className="d-flex flex-column">
                                    <label style={{ fontSize: "12px" }} htmlFor="start-date" className="form-label mb-0">Start Date:</label>
                                    <input style={{ fontSize: "12px" }} type="date" id="start-date" name="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)} className="form-control" />
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <label style={{ fontSize: "12px" }} htmlFor="end-date" className="form-label mb-0">End Date:</label>
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
                            <button className="pdf-button" onClick={handleQuotaionListGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleFireExcelExport}>Excel</button>
                            <button className="copy-button" onClick={handleCopy}>Copy</button>
                            <button className="copy-button" onClick={() => document.getElementById('column-visibility-menu')?.classList.toggle('show')}>
                                Column visibility
                            </button>
                        </div>
                        <div id="column-visibility-menu" className="column-visibility-menu" style={{ marginLeft: "17%", marginTop: "23%" }}>
                            {["Quotation No", "Name", "State/City", "Address", "Mobile No", "Actual Total", "Added By", "Action"].map(option => (
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
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuotationList;
