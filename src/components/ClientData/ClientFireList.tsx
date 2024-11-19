"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/ticket_list/custom.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import getUserProfile from '@/app/Api/UserProfile';
import { exportToFireListPDF } from '../Fire/Fire-List/pdfFireList';
import { exportToFireExcel } from '../Fire/Fire-List/FireExcel';

// export interface User {
//     febking_id: any;
//     client_email: any;
//     febking_created_by: any;
//     client_gstNo: any;
//     fest_id: any;
//     febking_final_amount: string;
//     client_firstName: string;
//     client_address: string;
//     email: string;
//     gstNo: string;
//     client_mobileNo: string;
//     vendorCode: string;
//     invNo: string;
//     certificateNo: string;
//     poNo: string;
//     febking_total_sgst: any;
//     febking_total_cgst: any;
//     febking_entry_type: 1;
//     febking_total_amount: string;
//     firstName: string;
//     address: string;
//     client_city: string;
//     client_state: string;
//     client_pincode: string;
//     mobileNo: string;
//     client_id: any;
//     created_by_name: any;
//     fest_name: string;   
//     febking_invoice_no: string;
//     product_data: {
//         feit_hsn_code: any;
//         qty: any;
//         rate: any;
//         totalAmount: any;
//         hsnCode: string;
//         capacity: string;
//         feit_id: any;
//         febd_sgst: any;
//         feb_name: any;
//         feit_name: any;
//         febd_cgst: any;
//         febd_sgst_amount: any;
//         febd_cgst_amount: any;
//         feb_id: string;
//     }[];

// }

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

export interface User {
    q_quotation_no: any;
    febking_id: any;
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

    // Add other properties as needed


interface ClientDataDisplayProps {
    title: string;
    data: User[] | null; // Expecting an array of client data
}

const ClientFireBookingList: React.FC<ClientDataDisplayProps> = ({ title, data }) => {
    const [records, setRecords] = useState<User[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<User[]>([]);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [userName, setUserName] = useState('');


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
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch user profile or roles:', error);
                });
        }
    }, []);
    useEffect(() => {
        if (data) {
            setRecords(data);
            setOriginalRecords(data);
        }
    }, [data]);
    

    const handleDeleteTicket = async (febking_id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = { febking_id };
        try {
            await axios.post(`http://192.168.0.106:3001/cabbooking/delete_cab_booking`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    useEffect(() => {
        const newColumns = [
            {
                name: "Invoice no",
                selector: (row: User) => row.febking_invoice_no,
                sortable: true,
            },
            {
                name: "Name",
                selector: (row: User) => row.client_firstName,
                sortable: true,
            },
            {
                name: "State/City",
                selector: (row: User) => `${row.client_state}, ${row.client_city}`,
                sortable: true,
            },
            {
                name: "Mobile No",
                selector: (row: User) => row.client_mobileNo,
                sortable: true,
            },
            {
                name: "Email",
                selector: (row: User) => row.client_email,
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
                    <div className='action-buttons'>
              
                    {userRoles.includes('fireExtinguisherBooking_view') && (
                        <Link href={`/Fire/Fire-List/FireView?id=${row.q_quotation_no}`} className="btn btn-sm btn-warning" >
                            <FontAwesomeIcon icon={faEye} />
                        </Link>
                    )}
                    {userRoles.includes('fireExtinguisherBooking_update') && (
                        <Link href={`/Fire/Fire-List/Edit?id=${row.q_quotation_no}`} className="btn btn-sm btn-primary">
                            <FontAwesomeIcon icon={faPencilSquare} />
                        </Link>
                    )}
                    {/* {userRoles.includes('fireExtinguisherBooking_delete') && (
                        <Link href={""} className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Link>
                    )} */}
                </div>
                ),
            }
        ];

        setColumns(newColumns);
    }, [userRoles]);

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



    return (
        <div style={{ fontSize: "12px" }} className="container-fluid mt-3">
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{title}</h4>
                </div>
                <div className='table-options'>
                <div className="action-buttons">
                            <button className="pdf-button" onClick={handleFireListGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleFireExcelExport}>Excel</button>
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

export default ClientFireBookingList;
