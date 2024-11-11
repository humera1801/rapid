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


export interface User {
    role_id: any;
    role_title: any;
    role_task: any;
    form_type: any;
    tasks: any;
}

const customStyle = {
    table: {
        style: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            maxWidth:"700px"
        
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


const RoleList: React.FC = () => {
    const [records, setRecords] = useState<User[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await CreateRole.GetRoleBooking();
                console.log('CreateRole.GetRoleBooking', res.data);
                setOriginalRecords(res.data);

                setRecords(res.data);
            } catch (error) {
                console.log('Err', error);
            }
        };
        fetchData();
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







































    const handleDeleteTicket = async (role_id: string,e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        console.log("id", role_id);
        const formData = {
            role_id: role_id
        }
        try {
            const response = await axios.post(`http://192.168.0.106:3001/employee/delete_role`, formData);
            console.log('role deleted successfully:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting role:', error);
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



    const columns: TableColumn<User>[] = [

        {
            name: "No",
            cell: (row: User, index: number) => index + 1,
            sortable: true,
            style: {
                minWidth: '20px',
                whiteSpace: 'nowrap'
            },

          
        },
        {
            name: "Role Title",
            selector: (row: User) => row.role_title,
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
                <div className='action-buttons'>

                    <Link href={`/RoleAssign/Edit?role_id=${row.role_id}`} className="btn btn-sm btn-primary">
                        <FontAwesomeIcon icon={faPencilSquare} />
                    </Link>
                    <button style={{fontSize:"9px"}} className="btn btn-sm btn-danger">
                        <FontAwesomeIcon onClick={(e) => handleDeleteTicket(row.role_id, e)} icon={faTrash} />
                    </button>
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







    return (
        <>
            <div className="container" style={{width:"500px" , marginTop:"10px"}}>
                <div className="card mb-3" style={{width:"500px" , marginTop:"20px"}}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Role List</h4>

                    </div>
                    <div className="table-options">

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
                    <div id="pdf-content" className='table table-striped new-table' >
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

export default RoleList;
