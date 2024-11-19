"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import "../../app/ticket_list/custom.css"
import "../../../public/css/style.css"
import Header from '@/components/Dashboard/Header';
import getUserProfile from '@/app/Api/UserProfile';
import GetPaymentListApi from '@/app/Api/PaymentApi/GetPaymentListApi';
// import { exportPaymentListPDF } from './PaymentPrint/PaymentListPDf';
// import { exportPaymentExcel } from './PaymentPrint/PaymentExcel';
import ClientListApi from '@/app/Api/ClientApi/ClientListApi';


export interface User {
    // id: string;
    voucher_no: any;
    vp_id: any;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    vendor_no: any;
    created_by_name: string;
    vendor_name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
    gst_no: string;
    bank_name: string;
    ac_no: string;
    ac_type: string;
    ifsc_code: string;
    bank_branch: string;
    transaction_id: { upi_id: string }[];
    created_by: any;
    vendor_address: any;
    vendor_type: any;
    id: any;
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


const VendorDashboardList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        'Voucher No', 'payment method',

        "Booking Of", "Vendor Name", "Paid Amount", "Payment Details",
        "Mobile-no", "Added By", "Action"
    ]);
    const [columnsOptions, setColumnsOptions] = useState<string[]>([
        'Voucher No', 'payment method',
        "Booking Of", "Vendor Name", "Paid Amount", "Payment Details",
        "Mobile-no", "Added By", "Action"
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
            const data = await GetPaymentListApi.getVandorPaymentList(startDate, endDate);
            console.log(data.data);
            const last10Records = data.data.slice(-10);
            setRecords(last10Records);
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


            const response = await GetPaymentListApi.getVandorPaymentList(startDate, endDate);
            setRecords(response.data);
        } catch (error) {
        }
    };




    const handleClearFilter = async () => {
        setStartDate('');
        setEndDate('');

        try {
            const data = await GetPaymentListApi.getVandorPaymentList();
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
            const data = await GetPaymentListApi.getVandorPaymentList(today);
            setRecords(data.data);
            console.log('Filtered data for today:', data.data);
        } catch (error) {
            console.error('Error fetching filtered data for today:', error);
        }
    };

























    const handleDeleteTicket = async (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("receipt_no", id);
        const formData = {
            id: id
        }
        try {
            const response = await axios.post(`http://192.168.0.106:3001/vendor/delete_vendor_payment`, formData);
            alert('Payment deleted successfully!');
            window.location.reload();

            console.log('payment deleted successfully:', response.data);
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




    const formatBookingType = (type: any) => {
        return type
            .split('_')
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };


    const columns: TableColumn<User>[] = [
        {
            name: "Voucher No",
            selector: (row: User) => row.voucher_no,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap',
                fontSize: "12px"
            },

            omit: !visibleColumns.includes("Voucher No")
        },
        {
            name: "Booking Of",
            cell: (row: User) => {
                let link;
                const formattedBookingType = formatBookingType(row.booking_type); // Format the booking type

                switch (row.booking_type) {
                    case 'cab_booking':
                        link = `/CabBooking/ViewCab?id=${row.vp_id}`;
                        break;
                    case 'fire_booking':
                        link = `/Fire/Fire-List/FireView?id=${row.vp_id}`;
                        break;
                    case 'parcel':
                        link = `/parcel_list/parcel_data?token=${row.vp_id}`;
                        break;
                    case 'ticket_booking':
                        link = `/ticket_list/Ticket_data?id=${row.vp_id}`;
                        break;
                    default:
                        return formattedBookingType; // Return formatted type
                }

                return (
                    <Link href={link} style={{ color: 'black', textDecoration: 'none' }}>
                        {formattedBookingType} {/* Use the formatted booking type here */}
                    </Link>
                );
            },
            sortable: true,
            style: {
                fontSize: "11px"
            },
        },

        {
            name: "Vendor Name",
            selector: (row: User) => row.vendor_name,
            sortable: true,
            cell: (row: any) => (
                <Link
                    href={`/Vendor/vendorview?id=${row.vendor_id}`} style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        backgroundColor: 'transparent',
                        padding: '5px',
                    }}
                >
                    {row.vendor_name}
                </Link>
            ),
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap',
                fontSize: "12px"
            },


            omit: !visibleColumns.includes("Vendor Name")
        },
        {
            name: "Mobile-no",
            selector: (row: User) => row.vendor_no,
            sortable: true,
            omit: !visibleColumns.includes("Mobile-no")
        },


        {
            name: "Paid Amount",
            selector: (row: User) => row.paid_amount,
            sortable: true,
            omit: !visibleColumns.includes("Paid Amount")
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

         
                    <div className=" d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Vendor Payment  List</h4>
                        <Link href="/Vendor/vendorPayment" className="btn btn-primary" style={{ fontSize: "12px" }}>View All</Link>

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

export default VendorDashboardList;