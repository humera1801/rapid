"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/ticket_list/custom.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faPlaneCircleCheck, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { generateCabReceiptPrint } from "../CabBooking/CabbookingPdf/PrintCabReceipt";
import { generateCabReceiptShare } from "../CabBooking/CabbookingPdf/ShareCabPrint";
import Link from 'next/link';
import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import { exportToCabListPDF } from './CabbookingPdf/PrintCabList';
import { exportToCabUserExcel } from './CabbookingPdf/PrintCabExcel';
import getUserProfile from '@/app/Api/UserProfile';
import { exportCabListPDF } from './CabbookingPdf/CabListPdf';
import { exportCabExcel } from './CabbookingPdf/CabExcel';

export interface User {
    id:any;
    created_by_name: any;
    cb_journey_end_date: any;
    cb_journey_start_date: any;
    cb_serial_no: any;
    cb_place_visit: any;
    cb_id: any;
    client_address: any;
    cb_created_by: any;
    client_mobileNo: any;
    client_firstName: any;
    client_city: any;
    client_state: any;
    vehicle_no: any;
    driver_name: any;
    cb_booking_date: any;
    engaged_by: any;
    address: any;
    place_visit: any;
    closing_kms: any;
    closing_time: any;
    closing_date: any;
    starting_time: any;
    starting_kms: any;
    waiting_date: any;
    starting_date: any;
    total_kms: any;
    waiting: any;
    rate_8hrs_80kms: any;
    rate_12hrs_300kms: any;
    extra_kms: any;
    extra_hrs: any;
    driver_allowance: any;
    night_charges: any;
    advance_rs: any;
    balance_rs: any;
}

const customStyle = {
    headRow: {
        style: {
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            fontSize: '12px',
        }
    },
    headCells: {
        style: {
            fontSize: '14px',
            fontWeight: '600',
        }
    },
    cells: {
        style: {
            fontSize: '12px',
        }
    }
};

const CabList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<User[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Cab sr.No", "Name", "State/City", "Booking Date", "Place Visit", "Mobile No", "Added By", "Action"
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
                    return axios.post('http://192.168.0.105:3001/employee/get_role_employee', { e_id });
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

    // Fetch data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const data = await CabbookingList.getCabFilterdate();
                setRecords(data.data);
                setOriginalRecords(data.data);
            } catch (error) {
                console.error('Error fetching all data:', error);
            }
        };
        fetchAllData();
    }, []);

    const handleDeleteTicket = async (cb_id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const formData = { cb_id: cb_id };
        try {
            await axios.post(`http://192.168.0.105:3001/cabbooking/delete_cab_booking`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting Cab:', error);
        }
    };

    useEffect(() => {
        const newColumns = [
            visibleColumns.includes('Cab sr.No') && {
                name: "Cab sr.No",
                selector: (row: User) => row.cb_serial_no,
                sortable: true,
            },
            visibleColumns.includes('Name') && {
                name: "Name",
                selector: (row: User) => row.client_firstName,
                sortable: true,
            },
            visibleColumns.includes('State/City') && {
                name: "State/City",
                selector: (row: User) => `${row.client_state}, ${row.client_city}`,
                sortable: true,
            },
            visibleColumns.includes('Booking Date') && {
                name: "Booking Date",
                selector: (row: User) => row.cb_booking_date,
                sortable: true,
            },
            visibleColumns.includes('Mobile No') && {
                name: "Mobile No",
                selector: (row: User) => row.client_mobileNo,
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
                    <div className='action-buttons' style={{ fontSize: "10px" }}>
                        {userRoles.includes('cabBooking') && (
                            <>
                                <button style={{ fontSize: "10px" }} className="btn btn-sm btn-success" onClick={() => handleShareClick(row.cb_id)}>
                                    Share
                                </button>
                                <button style={{ fontSize: "10px" }} className="btn btn-sm btn-info" onClick={() => handleCabPrint(row.cb_id)}>
                                    Print
                                </button>
                                {userRoles.includes('cabBooking_view') && (
                                    <Link href={`ViewCab?id=${row.cb_id}`} className="btn btn-sm btn-warning" >
                                        <FontAwesomeIcon icon={faEye} />
                                    </Link>
                                )}
                                {userRoles.includes('cabBooking_update') && (
                                    <Link href={`EditCabBooking?id=${row.cb_id}`} className="btn btn-sm btn-primary">
                                        <FontAwesomeIcon icon={faPencilSquare} />
                                    </Link>
                                )}
                                {userRoles.includes('cabBooking_delete') && (
                                    <button style={{ fontSize: "10px" }} onClick={(e) => handleDeleteTicket(row.cb_id, e)} className="btn btn-sm btn-danger">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ),
            },
        ].filter(Boolean);

        setColumns(newColumns);
    }, [visibleColumns, userRoles]);

    const handleCabPrint = async (cb_id: string) => {
        try {
            const getTDetail = await CabbookingList.GetcabBookingId(cb_id);
            generateCabReceiptPrint(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

    const handleShareClick = async (cb_id: string) => {
        try {
            const getTDetail = await CabbookingList.GetcabBookingId(cb_id);
            generateCabReceiptShare(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
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

    const handleGeneratePDF = () => {
        exportCabListPDF(records)
    };

    const handleCabExcelExport = () => {
        exportCabExcel(records);
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
        <div style={{ fontSize: "12px" }} className="container-fluid mt-3">
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Cab List</h4>
                    {/* Add your filter controls here */}
                </div>
                <div className='table-options'>
                    <div className="action-buttons">
                        <button className="pdf-button" onClick={handleGeneratePDF}>PDF</button>
                        <button className="excel-button" onClick={handleCabExcelExport}>Excel</button>
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
    );
};

export default CabList;
