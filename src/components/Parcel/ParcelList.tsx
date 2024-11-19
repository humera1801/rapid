"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "../../app/parcel_list/parcel_data/custom.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import Header from '@/components/Dashboard/Header';


import { Dropdown } from 'react-bootstrap';
import Footer from '@/components/Dashboard/Footer';
import getUserProfile from '@/app/Api/UserProfile';
import parceldate from '@/app/Api/FireApis/DataFilter/parceldate';
import EditParcelDataList from '@/app/Api/EditParcelDataList';
import handleParcelPrint from '@/app/parcel_list/parcel_data/printpparcelUtils';
import { handlebedgePrint } from '@/app/parcel_list/parcel_data/printparcelbedge';
import { handleparcelPDF } from '@/app/parcel_list/parcel_data/handleparcelPDF';
import { exportToParcelPDF } from '@/app/parcel_list/parcel_data/printParcelList';
import { exportParcelToExcel } from '@/app/parcel_list/parcel_data/exportParcelList';

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
    const [filterDate, setFilterDate] = useState<any>(null);

  





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
    
            const last10Records = data.data.slice(-10);
                setRecords(last10Records);
            setOriginalRecords(data.data);
    
        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };
    
 





    









    useEffect(() => {
        const newColumns = [
            visibleColumns.includes("Receipt No") && {
                name: "Receipt No",
                selector: (row: User) => row.receipt_no,
                sortable: true,
                cell: (row: User) => (
                    <Link
                        href={`parcel_list/parcel_data?token=${row.token}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {row.receipt_no}
                    </Link>
                ),
                style: {
                    minWidth: '50px',
                    whiteSpace: 'nowrap',
                    fontSize: "12px"
                },
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
           
           
           
           
           
        ].filter(Boolean);
        setColumns(newColumns);
    }, [visibleColumns, userRoles]);







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
            const response = await axios.post(`http://192.168.0.106:3001/parcel/remove_parcel_detail_data`, formData);
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

    const handleBedgeClick = async (ticketToken: string) => {
        try {
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);
            handlebedgePrint(getTDetail.data[0]);
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
            <div>

                <div className=" d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Parcel Booking List</h4>
                    <Link href="/parcel_list"  className="btn btn-primary" style={{fontSize:"12px"}}>View All</Link>
                </div>
                <div className='table table-striped new-table'>
                    <DataTable
                        columns={columns}
                        data={records}
                        customStyles={customStyle}
                    
                    />
                </div>

            </div>
        </>
    );
}

export default ParcelListPage;
