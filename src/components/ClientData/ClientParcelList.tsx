"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/ticket_list/custom.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import getUserProfile from '@/app/Api/UserProfile';
import { exportToParcelPDF } from '@/app/parcel_list/parcel_data/printParcelList';
import { exportParcelToExcel } from '@/app/parcel_list/parcel_data/exportParcelList';

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
    reciver_proof_detail: string;
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
    lr_no: number;
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

interface UserListProps {
    title: string;
    data: User[] | null; // Expecting an array of user data
}

const ClientParcelList: React.FC<UserListProps> = ({ title, data }) => {
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

    const handleDeleteUser = async (receipt_no: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = { receipt_no };
        try {
            await axios.post(`http://192.168.0.106:3001/user/delete`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        const newColumns = [
            {
                name: "Receipt No",
                selector: (row: User) => row.receipt_no,
                sortable: true,
            },
            {
                name: "Sender Name",
                selector: (row: User) => row.sender_name,
                sortable: true,
            },
            {
                name: "Receiver Name",
                selector: (row: User) => row.rec_name,
                sortable: true,
            },
            {
                name: "From City",
                selector: (row: User) => row.from_city_name,
                sortable: true,
            },
            {
                name: "To City",
                selector: (row: User) => row.to_city_name,
                sortable: true,
            },
            {
                name: "Mobile No",
                selector: (row: User) => row.rec_mob,
                sortable: true,
            },
            {
                name: "Added By",
                selector: (row: User) => row.added_by_name,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row: User) => (
                    <div className='action-buttons'>

                        {userRoles.includes('parcelBooking_view') && (
                            <Link href={`/parcel_list/parcel_data?token=${row.token}`} className="btn btn-sm btn-warning">
                                <FontAwesomeIcon icon={faEye} />
                            </Link>
                        )}
                        {userRoles.includes('parcelBooking_update') && (
                            <Link href={`/parcel_list/Edit?token=${row.token}`} className="btn btn-sm btn-primary">
                                <FontAwesomeIcon icon={faPencilSquare} />
                            </Link>
                        )}
                        {/* {userRoles.includes('parcelBooking_delete') && (
                            <button onClick={(e) => handleDeleteTicket(row.id, e)} className="btn btn-sm btn-danger">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
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


    const handleGeneratePDF = () => {
        exportToParcelPDF(records);
    };

    const handleExcelExport = () => {
        exportParcelToExcel(records);
    };
    return (
        <div style={{ fontSize: "12px" }} className="container-fluid mt-3">
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{title}</h4>
                </div>
                <div className='table-options'>
                    <div className="action-buttons">
                        <button className="pdf-button" onClick={handleGeneratePDF}>PDF</button>
                        <button className="excel-button" onClick={handleExcelExport}>Excel</button>
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

export default ClientParcelList;
