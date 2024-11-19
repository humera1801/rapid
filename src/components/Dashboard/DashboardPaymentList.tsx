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

import ClientListApi from '@/app/Api/ClientApi/ClientListApi';
import { generateCabPaymentReceiptPrint } from '../CabBooking/CabbookingPdf/cabpaymentreceipt';
import { generatePaymentReceiptPdf } from '../ClientData/ClientPrint/TransactionPrintPdf';
import { exportPaymentExcel } from '../Payment/PaymentPrint/PaymentExcel';
import { exportPaymentListPDF } from '../Payment/PaymentPrint/PaymentListPDf';


export interface User {
    id: string;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    total_amount: any;
    created_by_name: string;
    name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
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


const PaymentList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "Receipt No",
        "Booking Of", "Customer Name", "Payment Method", "Payment Details",
        "Amount", "Added By", "Action"
    ]);
    const [columnsOptions, setColumnsOptions] = useState<string[]>([
        "Receipt No",
        "Booking Of", "Customer Name", "Payment Method", "Payment Details",
        "Amount", "Added By", "Action"
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
            const data = await GetPaymentListApi.getpaymentFilterdate(startDate, endDate);
            console.log(data.data);

            const last10Records = data.data.slice(-10);
            setRecords(last10Records);
            setOriginalRecords(data.data)

        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };





























    const handleDeleteTicket = async (ticketId: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("receipt_no", ticketId);
        const formData = {
            receipt_no: ticketId
        }
        try {
            const response = await axios.post(`http://192.168.0.106:3001/payment/delete_payment`, formData);
            console.log('payment deleted successfully:', response.data);
            // window.location.reload();
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };



    const handleGeneratePDF = () => {
        exportPaymentListPDF(records)
    };

    const handleExcelExport = () => {
        exportPaymentExcel(records);
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
            name: "Receipt No",
            selector: (row: User) => row.receipt_no,
            sortable: true,
            cell: (row: any) => (
                <Link
                    href={`/PaymentData/PaymentView?receipt_no=${row.receipt_no}`} style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        backgroundColor: 'transparent',
                        padding: '5px',
                    }}
                >
                    {row.receipt_no}
                </Link>
            ),
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap',
                fontSize: "12px"
            },

            omit: !visibleColumns.includes("Receipt No")
        },
        {
            name: "Booking Of",
            cell: (row: User) => {
                let link;
                const formattedBookingType = formatBookingType(row.booking_type); // Format the booking type

                switch (row.booking_type) {
                    case 'cab_booking':
                        link = `/CabBooking/ViewCab?id=${row.id}`;
                        break;
                    case 'fire_booking':
                        link = `/Fire/Fire-List/FireView?id=${row.id}`;
                        break;
                    case 'parcel_booking':
                        link = `/parcel_list/parcel_data?token=${row.id}`;
                        break;
                    case 'ticket_booking':
                        link = `/ticket_list/Ticket_data?id=${row.id}`;
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
            name: "Customer Name",
            selector: (row: User) => row.name,
            sortable: true,

            omit: !visibleColumns.includes("Customer Name")
        },
        {
            name: "Total Amount",
            selector: (row: User) => row.total_amount,
            sortable: true,
            omit: !visibleColumns.includes("Amount")
        },

        

        // {
        //     name: "Payment Method",
        //     selector: (row: User) => row.payment_method,
        //     sortable: true,
        //     omit: !visibleColumns.includes("Payment Method")
        // },

        


       
    ];


    const handleCabPrint = async (receipt_no: string) => {
        try {
            const getTDetail = await ClientListApi.getTranSactionPrint(receipt_no);

            generateCabPaymentReceiptPrint(getTDetail.data[0]);
            console.log(getTDetail.data[0]);

        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

    const handleShareClick = async (receipt_no: string) => {
        try {
            const getTDetail = await ClientListApi.getTranSactionPrint(receipt_no);
            generatePaymentReceiptPdf(getTDetail.data[0]);
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };


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


            <div className="d-flex justify-content-between align-items-center" style={{ fontSize: "12px" }}>
                <h4 className="mb-0">Payment  List</h4>
               <div>
               <Link href="/PaymentData" className="btn btn-primary" style={{ fontSize: "12px" }}>View All</Link>
               </div>

            </div>

            <div id="pdf-content" className='table table-striped new-table'>
                <DataTable
                    columns={columns}
                    data={records}
                    customStyles={customStyle}
                    keyField="receipt_no"  

                  
                />
            </div>

        </>
    );
};

export default PaymentList;
