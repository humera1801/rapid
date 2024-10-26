"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/ticket_list/custom.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import getUserProfile from '@/app/Api/UserProfile';

export interface User {
    cb_id: string;
    cb_serial_no: any;
    cb_place_visit: string;
    cb_booking_date: any; // Change to appropriate type if needed
    client_firstName: string;
    client_mobileNo: string;
    client_state: string;
    client_city: string;
    created_by_name: string;
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

interface ClientData {
    cb_id: any;
    client_firstName: string;
    cb_place_visit: any;
    client_email: string;
    cb_serial_no: any;
    cb_booking_date: any;
    client_state: string;
    client_city: string;
    created_by_name: string;
}

interface ClientDataDisplayProps {
    title: string;
    data: ClientData[] | null; // Expecting an array of client data
}

const ClientBookingList: React.FC<ClientDataDisplayProps> = ({ title, data }) => {
    const [records, setRecords] = useState<User[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<User[]>([]);
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
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch user profile or roles:', error);
                });
        }
    }, []);

    useEffect(() => {
        if (data) {
            const transformedData: User[] = data.map(client => ({
                cb_id: client.cb_id,
                cb_serial_no: client.cb_serial_no,
                cb_place_visit: client.cb_place_visit,
                cb_booking_date: client.cb_booking_date,
                client_firstName: client.client_firstName,
                client_mobileNo: client.client_email,
                client_state: client.client_state,
                client_city: client.client_city,
                created_by_name: client.created_by_name,
            }));
            setRecords(transformedData);
            setOriginalRecords(transformedData);
        }
    }, [data]);

    const handleDeleteTicket = async (cb_id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = { cb_id };
        try {
            await axios.post(`http://192.168.0.105:3001/cabbooking/delete_cab_booking`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting Cab:', error);
        }
    };

    useEffect(() => {
        const newColumns = [
            {
                name: "Cab sr.No",
                selector: (row: User) => row.cb_serial_no,
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
                name: "Booking Date",
                selector: (row: User) => row.cb_booking_date,
                sortable: true,
            },
            {
                name: "Mobile No",
                selector: (row: User) => row.client_mobileNo,
                sortable: true,
            },
            {
                name: "Place Visit",
                selector: (row: User) => row.cb_place_visit,
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
                        {userRoles.includes('cabBooking') && (
                            <>
                                <Link href={`ViewCab?id=${row.cb_id}`} className="btn btn-sm btn-warning">
                                    <FontAwesomeIcon icon={faEye} />
                                </Link>
                                <Link href={`EditCabBooking?id=${row.cb_id}`} className="btn btn-sm btn-primary">
                                    <FontAwesomeIcon icon={faPencilSquare} />
                                </Link>
                                {/* <button style={{ fontSize: "9px" }} onClick={(e) => handleDeleteTicket(row.cb_id, e)} className="btn btn-sm btn-danger">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button> */}
                            </>
                        )}
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

    return (
        <div style={{ fontSize: "12px" }} className="container-fluid mt-3">
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{title}</h4>
                </div>
                <div className='table-options'>
                    <div className="action-buttons">

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

export default ClientBookingList;
