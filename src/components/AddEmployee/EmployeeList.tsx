"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import "../../app/ticket_list/custom.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CreateRole from '@/app/Api/RoleApi/CreateRole';
import EmployeeList from '@/app/Api/Employee/EmployeeList';
import getUserProfile from '@/app/Api/UserProfile';
import { exportEmployeeListPDF } from './EmployeePrint/PDFList';
import { exportEmployeeExcel } from './EmployeePrint/ExcelList';


export interface User {
    e_id: any
    e_name: string;
    e_email: string;
    e_password: string;
    confirmPassword: string;
    e_mobile_no: string;
    e_address: string;
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


const EmpList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);
    const storedData = localStorage.getItem('userData');

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



    const handleDeleteTicket = async (e_id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const formData = { e_id: e_id };
        try {
            await axios.post(`http://192.168.0.105:3001/employee/delete_employee`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting Cab:', error);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await EmployeeList.GetEmpList();
                console.log(' EmployeeList.GetEmpList', res);
                setOriginalRecords(res.data);

                setRecords(res.data);
            } catch (error) {
                console.log('Err', error);
            }
        };
        fetchData();
    }, []);







    const columns: TableColumn<User>[] = [
        {
            name: "No",
            cell: (row: User, index: number) => index + 1,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap',
            },
        },
        {
            name: "Name",
            selector: (row: User) => row.e_name,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap'
            },

        },
        {
            name: "Email",
            selector: (row: User) => row.e_email,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap'
            },

        },
        {
            name: "Mobile No",
            selector: (row: User) => row.e_mobile_no,
            sortable: true,
            style: {
                minWidth: '50px',
                whiteSpace: 'nowrap'
            },

        },
       



        {
            name: "Action",
            style: {
                display: 'flex',
                alignItems: 'center',
                flex: '1 1 0',
            },
            cell: (row: User) => (
                <div className='action-buttons' style={{paddingRight : "2%"}}>
                    {/* {userRoles.includes('Employee_assignRole') && (
                        <Link href={`RoleAssign?id=${row.e_id}`} className="btn btn-sm btn-success" >Assign Role</Link>
                    )} */}
                    {userRoles.includes('Employee_change-password') && (
                        <Link href={`EmpChangePass?id=${row.e_id}`} className="btn btn-sm btn-info" >Change Password</Link>
                    )}
                    {userRoles.includes('Employee_edit') && (
                        <Link href={`EmpEdit?id=${row.e_id}`} className="btn btn-sm btn-primary">

                            <FontAwesomeIcon icon={faPencilSquare} />
                        </Link>
                    )}
                    {userRoles.includes('cabBooking_view') && (
                        <Link href={`EmpView?id=${row.e_id}`} className="btn btn-sm btn-warning" >
                            <FontAwesomeIcon icon={faEye} />
                        </Link>
                    )}
                    {userRoles.includes('Employee_delete') && (

                        <button style={{ fontSize: "10px" }} onClick={(e) => handleDeleteTicket(row.e_id, e)} className="btn btn-sm btn-danger">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}

                </div>
            ),
        }
    ];




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




    const handleGeneratePDF = () => {
        exportEmployeeListPDF(records)
    };

    const handleClientExcelExport = () => {
        exportEmployeeExcel(records);
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
        <>
            <div className="container-fluid mt-3">
                <div className="card mb-3" style={{ width: 'auto' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Employee List</h4>

                    </div>
                    <div className="table-options">

                        <div className="action-buttons">
                        <button className="pdf-button" onClick={handleGeneratePDF}>PDF</button>
                            <button className="excel-button" onClick={handleClientExcelExport}>Excel</button>
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
                    <div id="pdf-content" className='table table-striped new-table'>
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
};

export default EmpList;
