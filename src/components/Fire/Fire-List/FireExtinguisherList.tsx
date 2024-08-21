// components/DataTable.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../../app/ticket_list/custom.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faPlaneCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from '@/components/Dashboard/Header';
import getListFireData from '@/app/Api/FireApis/FireExtinghsherList/getListFireData';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import { FirePdf } from "../Fire-List/FirePdf.js";
import { handleFireDataPrint } from "./printFireUtills.js";
import "../../../../public/css/style.css";
import { exportToFireListPDF } from './pdfFireList';
import { exportToFireExcel } from './FireExcel';

export interface User {
    febking_id: any;
    client_email: any;
    febking_created_by: any;
    client_gstNo: any;
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
    client_id: any;
    created_by_name: any;
    fest_name: string;
    febking_invoice_no: string;
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

const FireExtinguisherList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Invoice No", "Name", "State/City", "Address", "Mobile No", "Actual Total", "Added By", "Action"
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getListFireData.getFireListData();


                setOriginalRecords(res);


                 setRecords(res);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const newColumns = [
            visibleColumns.includes('Invoice No') && {
                name: "Invoice No",
                selector: (row: User) => row.febking_invoice_no,
                sortable: true,
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
                selector: (row: User) => row.febking_final_amount,
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
                        <button className="btn btn-sm btn-success" style={{ color: '#ffffff' }} onClick={() => handleFireShareClick(row.febking_id)}>Share</button>
                        <button className="btn btn-sm btn-info" style={{ color: '#ffffff' }} onClick={() => handleFirePrintClick(row.febking_id)}>Print</button>
                        <Link href={`Fire-List/FireView?id=${row.febking_id}`} className="btn btn-sm btn-warning" style={{ color: '#ffffff' }}>
                            <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link href={`Fire-List/Edit?id=${row.febking_id}`} className="btn btn-sm btn-primary">
                            <FontAwesomeIcon icon={faPencilSquare} />
                        </Link>
                        <Link href={""} className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Link>
                    </div>
                ),
            },
        ].filter(Boolean);

        setColumns(newColumns);
    }, [visibleColumns]);

    const handleFirePrintClick = async (febking_id: string) => {
        try {
            const getTDetail = await getFireBookingId.GetFireBookingId(febking_id);
            handleFireDataPrint(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

    const handleFireShareClick = async (febking_id: string) => {
        try {
            const getTDetail = await getFireBookingId.GetFireBookingId(febking_id);
            FirePdf(getTDetail.data[0]);
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

    const handleFireListGeneratePDF = () => {
        exportToFireListPDF(records);
    };

    const handleFireExcelExport = () => {
        exportToFireExcel(records);
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

    const [entriesPerPage, setEntriesPerPage] = useState<number>(10); 

    const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEntriesPerPage(parseInt(event.target.value, 10));
    };





    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>
                    <div className="card-header">
                        <h4>Fire Extinguisher List</h4>
                    </div>
                    <div className="table-options">
                        {/* <div className="entries-selector">
                            <label htmlFor="entries">Show </label>
                            <select id="entries" value={entriesPerPage} onChange={handleEntriesPerPageChange}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span> entries</span>
                        </div> */}
                        <div className="action-buttons">
                            <button className="pdf-button" onClick={handleFireListGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleFireExcelExport}>Excel</button>
                            <button className="copy-button" onClick={handleCopy}>Copy</button>
                            <button className="copy-button" onClick={() => document.getElementById('column-visibility-menu')?.classList.toggle('show')}>
                                Column visibility
                            </button>
                        </div>
                        <div id="column-visibility-menu" className="column-visibility-menu"  style={{marginLeft:"17%" , marginTop:"23%"}}>
                            {["Invoice No", "Name", "State/City", "Address", "Mobile No", "Actual Total", "Added By", "Action"].map(option => (
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

export default FireExtinguisherList;
