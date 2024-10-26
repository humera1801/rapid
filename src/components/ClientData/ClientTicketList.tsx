"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/ticket_list/custom.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import getUserProfile from '@/app/Api/UserProfile';
import { exportToExcel } from '@/app/ticket_list/Ticket_data/exportToexcel';
import { exportToPDF } from '@/app/ticket_list/Ticket_data/PdfTicketList';

export interface BusTicket {
    id: string;
    user_id: string;
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
    client_firstName: any;
    client_mobileNo: any;
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

interface BusTicketListProps {
    title: string;
    data: BusTicket[] | null; // Expecting an array of bus ticket data
}

const ClientTicketList: React.FC<BusTicketListProps> = ({ title, data }) => {
    const [records, setRecords] = useState<BusTicket[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<BusTicket[]>([]);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [userName, setUserName] = useState('');

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
            setRecords(data);
            setOriginalRecords(data);
        }
    }, [data]);

    const handleDeleteTicket = async (tkt_no: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = { tkt_no };
        try {
            await axios.post(`http://192.168.0.105:3001/busticket/delete`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    useEffect(() => {
        const newColumns = [
            {
                name: "Ticket No",
                selector: (row: BusTicket) => row.tkt_no,
                sortable: true,
            },
            {
                name: "Passenger Name",
                selector: (row: BusTicket) => row.client_firstName,
                sortable: true,
            },
            {
                name: "From City",
                selector: (row: BusTicket) => row.from_city_name,
                sortable: true,
            },
            {
                name: "To City",
                selector: (row: BusTicket) => row.to_city_name,
                sortable: true,
            },
            {
                name: "Mobile No",
                selector: (row: BusTicket) => row.client_mobileNo,
                sortable: true,
            },
            {
                name: "Added By",
                selector: (row: BusTicket) => row.added_by_name,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row: BusTicket) => (
                    <div className='action-buttons'>
                       
                        {userRoles.includes('ticketBooking_view') && (
                            <Link href={`ticket_list/Ticket_data?token=${row.token}`} className="btn btn-sm btn-warning">
                                <FontAwesomeIcon icon={faEye} />
                            </Link>
                        )}
                        {userRoles.includes('ticketBooking_update') && (
                            <Link href={`ticket_list/Edit?token=${row.token}`} className="btn btn-sm btn-primary">
                                <FontAwesomeIcon icon={faPencilSquare} />
                            </Link>
                        )}
                        {/* {userRoles.includes('ticketBooking_delete') && (
                            <button
                                onClick={(e) => handleDeleteTicket(row.tkt_no, e)}
                                className="btn btn-sm btn-danger" style={{ cursor: 'pointer', color: '#ffffff' }}>
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

        const newData = originalRecords.filter((row: BusTicket) =>
            Object.values(row).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm)
            )
        );

        setRecords(newData);
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

export default ClientTicketList;
