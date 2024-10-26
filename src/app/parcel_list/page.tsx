"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../parcel_list/parcel_data/custom.css"
import GetParcelList from '../Api/GetParcelList';
import EditParcelDataList from '../Api/EditParcelDataList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { handleparcelPDF } from '../parcel_list/parcel_data/handleparcelPDF';
import { exportToParcelPDF } from './parcel_data/printParcelList';
import { exportParcelToExcel } from './parcel_data/exportParcelList';
import Header from '@/components/Dashboard/Header';
import handleParcelPrint from './parcel_data/printpparcelUtils';
import "../parcel_list/parcel.css"
import parceldate from '../Api/FireApis/DataFilter/parceldate';
import getUserProfile from '../Api/UserProfile';
import { Dropdown } from 'react-bootstrap';

export interface User {
    id: any;
    token: any;
    parcel_status: any;
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
    sender_whatsapp_no: any;
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
            fontSize: '14px',
        }
    },
    headCells: {
        style: {
            fontSize: '12px',
            fontWeight: '600',
            padding: '12px',

        }
    },
    cells: {
        style: {
            fontSize: '12px',
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

const ParcelListPage = () => {




    const [records, setRecords] = useState<User[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Receipt No",
        "Booking Date",
        "From",
        "To",
        "Sender",
        "Status",
        "Receiver",
        "Date",
        "Added By",
        "Action"
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



    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filterDate, setFilterDate] = useState<any>(null);

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
        lastMonth.setMonth(today.getMonth() - 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        return {
            startDate: formatDate(lastMonth),
            endDate: formatDate(today)
        };
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

    const fetchAllData = async () => {

        const { startDate, endDate } = getDateRange();

        try {
            const data = await parceldate.getparcelFilterdate(startDate, endDate);
            console.log(data.data);

            setRecords(data.data);
            setOriginalRecords(data.data)

        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };



    const handlefilterdate = async (startdate: string, enddate: string) => {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                alert('End date must be greater than start date');

                return;
            }


            const response = await parceldate.getparcelFilterdate(startDate, endDate);
            console.log(response.data);

            setRecords(response.data);
        } catch (error) {
        }
    };




    const handleClearFilter = async () => {
        setStartDate('');
        setEndDate('');

        try {
            const data = await parceldate.getparcelFilterdate();
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
            const data = await parceldate.getparcelFilterdate(today);
            setRecords(data.data);
            console.log('Filtered data for today:', data.data);
        } catch (error) {
            console.error('Error fetching filtered data for today:', error);
        }
    };










    useEffect(() => {
        const newColumns = [
            visibleColumns.includes("Receipt No") && {
                name: "Receipt No",
                selector: (row: User) => row.receipt_no,
                sortable: true,
            },
            visibleColumns.includes("Booking Date") && {
                name: "Booking Date",
                selector: (row: User) => row.booking_date,
                sortable: true,
            },
            visibleColumns.includes("From") && {
                name: "From",
                selector: (row: User) => `${row.from_state_name}, ${row.from_city_name}`,
                sortable: true,
            },
            visibleColumns.includes("To") && {
                name: "To",
                selector: (row: User) => `${row.to_state_name}, ${row.to_city_name}`,
                sortable: true,
            },
            visibleColumns.includes("Sender") && {
                name: "Sender",
                selector: (row: User) => row.sender_name,
                sortable: true,
            },
            visibleColumns.includes("Receiver") && {
                name: "Receiver",
                selector: (row: User) => row.rec_name,
                sortable: true,
            },
            visibleColumns.includes("Date") && {
                name: "Date",
                selector: (row: User) => row.dispatch_date,
                sortable: true,
            },
            visibleColumns.includes("Added By") && {
                name: "Added By",
                selector: (row: User) => row.added_by_name,
                sortable: true,
            },
            visibleColumns.includes("Status") && {
                name: "Status",
                cell: (row: User) => (
                   
                        <Dropdown style={{ fontSize: "10px" }}>

                            <Dropdown.Toggle className={`btn btn-sm ${row.parcel_status == '0' ? 'btn-primary' : row.parcel_status == '1' ? 'btn-warning' : row.parcel_status == '2' ? 'btn-success' : 'btn-secondary'}`}
                                id="dropdown-basic" style={{ fontSize: "10px", display: "flex", alignItems: "center  " }}>
                                {
                                    row.parcel_status == '0' ? (
                                        <>Booked</>
                                    ) : row.parcel_status == '1' ? (
                                        <><a style={{ color: "black", display: "flex", fontSize: "10px" }}>In-Transit</a></>
                                    ) : row.parcel_status == '2' ? (
                                        <>Delivered</>
                                    ) : (
                                        <></>
                                    )
                                }
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ justifyContent: "center" }}>
                                <Dropdown.Item href="" onClick={() => handleStatus(row.id, 0)} >Booked</Dropdown.Item>
                                <Dropdown.Item href="" onClick={() => handleStatus(row.id, 1)} >In-Transit</Dropdown.Item>
                                <Dropdown.Item href="" onClick={() => handleStatus(row.id, 2)} >Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>


                ),
            },
            visibleColumns.includes("Action") && {
                name: "Action",
                cell: (row: User) => (
                    <div className='action-buttons'>
                    
                        <button className="btn btn-sm btn-success" style={{ fontSize: "10px" }} onClick={() => handleShareClick(row.token)}>Share</button>
                        <button className="btn btn-sm btn-info" style={{ fontSize: "10px" }} onClick={() => handlePrintClick(row.token)}>Print</button>
                        {userRoles.includes('parcelBooking_view') && (
                            <Link href={`parcel_list/parcel_data?token=${row.token}`} className="btn btn-sm btn-warning">
                                <FontAwesomeIcon icon={faEye} />
                            </Link>
                        )}
                        {userRoles.includes('parcelBooking_update') && (
                            <Link href={`parcel_list/Edit?token=${row.token}`} className="btn btn-sm btn-primary">
                                <FontAwesomeIcon icon={faPencilSquare} />
                            </Link>
                        )}
                        {userRoles.includes('parcelBooking_delete') && (

                            <button style={{ width: "25px", padding: "5px" }} onClick={(e) => handleDeleteTicket(row.id, e)} className="btn btn-sm btn-danger">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </div>

                ),
            },
        ].filter(Boolean);
        setColumns(newColumns);
    }, [visibleColumns, userRoles]);

    const handleEditClick = (ticketId: string) => {
        console.log('Edit ticket', ticketId);
    };






    const handleStatus = async (id: number, parcel_status: any) => {
        try {
            const response = await EditParcelDataList.getstatusParcelData(id.toString(), parcel_status);


            console.log(">>>>>>", response.data);


            window.location.reload();




        } catch (error) {
            console.error('Error handling status:', error);

        }
    };


















    const handleDeleteTicket = async (ticketId: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const formData = { parcel_id: ticketId };
            const response = await axios.post(`http://192.168.0.105:3001/parcel/remove_parcel_detail_data`, formData);
            console.log('Ticket deleted successfully:', response.data);
            setRecords(records.filter(record => record.id !== ticketId));
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const handlePrintClick = async (ticketToken: string) => {
        try {
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);
            handleParcelPrint(getTDetail.data[0]);
        } catch (error) {
            console.error('Error fetching parcel data:', error);
        }
    };

    const handleShareClick = async (ticketToken: string) => {
        try {
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);
            handleparcelPDF(getTDetail.data[0]);
        } catch (error) {
            console.error('Error fetching parcel data:', error);
        }
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

    const handleColumnVisibilityChange = (column: string, isVisible: boolean) => {
        if (isVisible) {
            setVisibleColumns([...visibleColumns, column]);
        } else {
            setVisibleColumns(visibleColumns.filter(col => col !== column));
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




    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Parcel Booking List</h4>
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <div className="d-flex flex-column">
                                    <label htmlFor="start-date" style={{ fontSize: "12px" }} className="form-label mb-0">Start Date:</label>
                                    <input style={{ fontSize: "12px" }} type="date" id="start-date" name="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)} className="form-control" />
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <label htmlFor="end-date" style={{ fontSize: "12px" }} className="form-label mb-0">End Date:</label>
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
                        {/* <div className="entries-selector">
                            <label htmlFor="entries">Show </label>
                            <select id="entries">
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>entries</span>
                        </div> */}
                        <div className="action-buttons">
                            <button className="pdf-button" onClick={handleGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleExcelExport}>Excel</button>
                            <button className="copy-button" onClick={handleCopy}>Copy</button>
                            <button className="copy-button" onClick={() => document.getElementById('column-visibility-menu')?.classList.toggle('show')}>
                                Column visibility
                            </button>
                        </div>
                        <div id="column-visibility-menu" className="column-visibility-menu" style={{ marginLeft: "18%", marginTop: "25%" }}>
                            {["Receipt No", "Booking Date", "From", "To", "Sender", "Status", "Receiver", "Date", "Added By", "Action"].map(option => (
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
                    <div className='table table-striped new-table'>
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
}

export default ParcelListPage;
