"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/app/Api/UserProfile';
import axios from 'axios';
import "../../../public/css/style.css"
import "./nav.css"

function Header() {
  const router = useRouter();
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
            setUserRoles(rolesData[0].e_task); // Assuming e_task contains the role identifiers
          }
        })
        .catch((error) => {
          console.error('Failed to fetch user profile or roles:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/');
  };

  return (
    <div className="header2">
      <Navbar className="navbar navbar-expand-sm bg-light" style={{ padding: "0px" }}>
        <div className="container-fluid" style={{ padding: "0px 1%", backgroundColor: "#dcdcdc" }}>
          <Link className="navbar-brand logo1" href="/Home">
            <img src="\img\logo_page-0001-removebg-preview.png" alt="" className="logohead1" />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto w-100" id="collapsibleNavbar">
              <ul className="navbar-nav ul1">
                <Link href="/Home" className="nav-link custom-nav-link"> Home</Link>

                {userRoles.includes('ticketBooking') && (
                  <NavDropdown title="Bus Ticket" id="basic-nav-dropdown" className="custom-nav-dropdown">
                    {userRoles.includes('ticketBooking_create') && (
                      <NavDropdown.Item as={Link} href="/Home/Ticket" className="custom-dropdown-item nav-link">
                        <span className='nav-link'> Add Ticket Booking</span>
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item className="custom-dropdown-item" as={Link} href="/ticket_list" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Ticket Booking List</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {userRoles.includes('parcelBooking') && (
                  <NavDropdown title="Parcel" id="basic-nav-dropdown" className="custom-nav-dropdown">
                    {userRoles.includes('parcelBooking_create') && (
                      <NavDropdown.Item as={Link} href="/Home/parcel" className="custom-dropdown-item nav-link">
                        <span className='nav-link'> Add Parcel Booking</span>
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item className="custom-dropdown-item" as={Link} href="/parcel_list" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Parcel Booking List</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {userRoles.includes('cabBooking') && (
                  <NavDropdown title="Cab" id="basic-nav-dropdown" className="custom-nav-dropdown">
                    {userRoles.includes('cabBooking_create') && (
                      <NavDropdown.Item as={Link} href="/CabBooking/CreateCabBooking" className="custom-dropdown-item nav-link">
                        <span className='nav-link'> Add Cab Booking</span>
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item as={Link}  href="/CabBooking/CabList" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Cab Booking List</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} href="/CabBooking/Vehicle" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Vehicle List</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {userRoles.includes('fireExtinguisherBooking') && (
                  <NavDropdown title="Fire Extinguisher" id="basic-nav-dropdown" className="custom-nav-dropdown">
                    <NavDropdown.Item as={Link} href="/Fire/Add-Brand" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Add Brand</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} href="/Fire/Add-Ingredient" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Add Item</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} href="/Fire/Add-Service" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Add Service</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link}  href="/Fire/Fire-List"  className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Fire Booking List</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    {userRoles.includes('fireDeliveryChallan') && (
                      <NavDropdown.Item as={Link} href="/DeliveryChallan/ListOfChallan" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                        <span className='nav-link'> Delivery Challan List</span>
                      </NavDropdown.Item>
                    )}
                    {userRoles.includes('fireReceiverChallan') && (
                      <NavDropdown.Item  as={Link} href="/Receiver/List" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                        <span className='nav-link'> Receiver Challan List</span>
                      </NavDropdown.Item>
                    )}
                    {userRoles.includes('fireQuotation') && (
                      <NavDropdown title="Quotation" drop="start" id="basic-nav-dropdown" className="custom-dropdown-item" style={{ marginLeft: "5px" }}>
                        {userRoles.includes('fireQuotation_create') && (
                          <NavDropdown.Item as={Link} href="/Quotation/CreateQuotation" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                            <span className='nav-link'> Add Quotation</span>
                          </NavDropdown.Item>
                        )}
                        <NavDropdown.Item as={Link}  href="/Quotation/QuotationList" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                          <span className='nav-link'> Quotation List</span>
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                  </NavDropdown>
                )}

                {userRoles.includes('Employee') && (
                  <NavDropdown title="Employee" id="basic-nav-dropdown" className="custom-nav-dropdown">
                    {userRoles.includes('Employee_create') && (
                      <NavDropdown.Item as={Link}  href="/Employee/Create"  className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                        <span className='nav-link'> Create Employee</span>
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item as={Link} href="/Employee/EmpList" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                      <span className='nav-link'> Employee List</span>
                    </NavDropdown.Item>
                    <NavDropdown title="Create Employee Role" id="basic-nav-dropdown" className="custom-dropdown-item" drop="start">
                      <NavDropdown.Item  as={Link} href="/RoleAssign/Create" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                        <span className='nav-link'> Create Employee Role</span>
                      </NavDropdown.Item>
                      <NavDropdown.Item  as={Link} href="/RoleAssign/List" className="custom-dropdown-item" style={{ marginTop: '10px' }}>
                        <span className='nav-link'> Role List</span>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </NavDropdown>
                )}

                <Link className="nav-link custom-nav-link" href="/PaymentData">
                  Payments
                </Link>

                {userRoles.includes('Client') && (
                  <Link className="nav-link custom-nav-link" href="/ClientDetails/ClientList">
                  Clients
                  </Link>
                )}

                {userName && (
                  <NavDropdown className="custom-dropdown-item" title={userName} id="collapsible-nav-dropdown">
                    <NavDropdown.Item as={Link}  className="nav-link custom-dropdown-item" href="/Change_Password">
                      <span className='nav-link'> Change Password</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item  className="nav-link custom-dropdown-item" onClick={handleLogout}>
                      <span className='nav-link'> Log-out</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </ul>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
}

export default Header;
