"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import "../../app/ticket_list/custom.css"
import "../Dashboard/nav.css"
import "../../../public/css/style.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from '@/components/Dashboard/Header';
import Footer from '@/components/Dashboard/Footer';
import getUserProfile from '@/app/Api/UserProfile';
import ticketdate from '@/app/Api/FireApis/DataFilter/ticketdate';

export interface User {
    id: string;
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
    st_print_rate: any;
    slr_print_rate: any;
    ex_print_rate: any;
    dep_time: any;
    is_duplicate: any;
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


const TicketList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Receipt No", "Customer Name", "From", "To", "Booking Date", "Journey Date",
        "Amount", "Print Amount", "Mobile-no", "Added By", "Action"
    ]);
    const [columnsOptions, setColumnsOptions] = useState<string[]>([
        "Receipt No", "Customer Name", "From", "To", "Booking Date", "Journey Date",
        "Amount", "Print Amount", "Mobile-no", "Added By", "Action"
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
            const data = await ticketdate.getticketFilterdate(startDate, endDate);
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


            const response = await ticketdate.getticketFilterdate(startDate, endDate);
            setRecords(response.data);
        } catch (error) {
        }
    };




    const handleClearFilter = async () => {
        setStartDate('');
        setEndDate('');

        try {
            const data = await ticketdate.getticketFilterdate();
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
            const data = await ticketdate.getticketFilterdate(today);
            setRecords(data.data);
            console.log('Filtered data for today:', data.data);
        } catch (error) {
            console.error('Error fetching filtered data for today:', error);
        }
    };

























    const handleDeleteTicket = async (ticketId: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("id", ticketId);
        const formData = {
            ticket_id: ticketId
        }
        try {
            const response = await axios.post(`http://192.168.0.106:3001/ticket/remove_ticket_data`, formData);
            console.log('Ticket deleted successfully:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting ticket:', error);
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

    const handleColumnVisibilityChange = (column: string, isChecked: boolean) => {
        setVisibleColumns(prevState =>
            isChecked ? [...prevState, column] : prevState.filter(col => col !== column)
        );
    };

    const getRowStyle = (row: any) => ({
        backgroundColor: row.is_duplicate === '1' ? 'red' : 'transparent',
        color: row.is_duplicate === '1' ? 'white' : 'black',
    });
    const columns: TableColumn<User>[] = [
        {
            name: "Receipt No",
            selector: (row: User) => row.tkt_no,
            sortable: true,
            cell: (row) => (
                <div className='row'>
                    <Link
                        href={`ticket_list/Ticket_data?token=${row.token}`}
                        style={{
                            textDecoration: 'none',
                            color:  'inherit',
                            backgroundColor:  'transparent',
                            padding: '5px',
                        }}
                    >
                        {row.tkt_no}
                    </Link>
                    {row.is_duplicate === '1' && (
                        <span style={{ color: 'blue', fontSize: '8px', marginTop: '5px' }}>
                            Duplicate
                        </span>
                    )}
                </div>
            ),
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap',
                fontSize: "12px"
            },
            omit: !visibleColumns.includes("Receipt No")
        },
        {
            name: "Customer Name",
            selector: (row: User) => row.client_firstName,

            sortable: true,
           





            
            omit: !visibleColumns.includes("Customer Name")
        },
        {
            name: "From",
            selector: (row: User) => `${row.from_state_name}, ${row.from_city_name}`,
            sortable: true,
            omit: !visibleColumns.includes("From")
        },
        {
            name: "To",
            selector: (row: User) => `${row.to_state_name}, ${row.to_city_name}`,
            sortable: true,
            omit: !visibleColumns.includes("To")
        },
        {
            name: "Booking Date",
            selector: (row: User) => row.bdate,
            sortable: true,
            omit: !visibleColumns.includes("Booking Date")
        },
     
       
    ];




    const [searchTerm, setSearchTerm] = useState<string>('');
    const [originalRecords, setOriginalRecords] = useState<User[]>([]);


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
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Ticket Booking List</h4>
                        <Link href="/ticket_list"  className="btn btn-primary" style={{fontSize:"12px"}}>View All</Link>

                    </div>
                  
                    <div id="pdf-content" className='table table-striped new-table'>
                        <DataTable
                            columns={columns}
                            data={records}
                            customStyles={customStyle}
                         
                        />
                    </div>
            

        </>
    );
};

export default TicketList;
