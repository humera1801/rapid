"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import "../../../public/css/style.css"

import { useRouter } from 'next/navigation';
import getUserProfile from '@/app/Api/UserProfile';


interface a {
  e_name: any;
}



function Header() {



  const router = useRouter();

  const [userName, setUserName] = useState('');

  useEffect(() => {

    const storedData = localStorage.getItem('userData');

    console.log("storedData", storedData);

    if (storedData) {
      getUserProfile(parseInt(storedData, 10))
        .then((userData) => {
          setUserName(userData.e_name);
        })
        .catch((error) => {
          console.error('Failed to fetch user profile:', error);

        });
    } else {

    }
  }, []);





  const handleLogout = () => {

    localStorage.removeItem('userData');
    router.push('/');
  };




  return (
    <>


      <div className="header2">

        <Navbar expand="lg" className="navbar navbar-expand-sm bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand logo1" href="/Home">
              <img src="\img\logo_page-0001-removebg-preview.png" alt="" className="logohead1" />
            </Link>

            <Navbar.Brand href="#" className='banner'>Rapid Group</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">

              <Nav className="me-auto w-100" id="collapsibleNavbar" >

                <ul className="navbar-nav ul1 " >
                  {/* <li >
                    <Link href="/Home" className="nav-link">Home</Link>
                  </li> */}
                  <NavDropdown title=" Ticket Booking" id="basic-nav-dropdown" className="custom-nav-dropdown">

                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/Home/Ticket" className="nav-link custom-nav-link">Add Ticket Booking</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/ticket_list" className="nav-link custom-nav-link">Ticket Booking List</Link>
                    </NavDropdown.Item>

                  </NavDropdown>
                  <NavDropdown title=" Parcel Booking" id="basic-nav-dropdown" className="custom-nav-dropdown">

                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/Home/parcel" className="nav-link custom-nav-link">Add Parcel Booking</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/parcel_list" className="nav-link custom-nav-link">Parcel Booking List</Link>
                    </NavDropdown.Item>

                  </NavDropdown>

                  <NavDropdown title="Fire Extinguisher" id="basic-nav-dropdown" className="custom-nav-dropdown">
                    <NavDropdown.Item as="div" className="custom-dropdown-item">
                      <Link className="nav-link custom-nav-link" href="/Fire/Fire-Extinguisher">
                        Fire Extinguisher Booking
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/Fire/Add-Brand" className="nav-link custom-nav-link">Add Brand</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/Fire/Add-Ingredient" className="nav-link custom-nav-link">Add Item</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/Fire/Add-Service" className="nav-link custom-nav-link">Add Service</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="custom-dropdown-item">
                      <Link href="/Fire/Fire-List" className="nav-link custom-nav-link">Fire Booking List</Link>
                    </NavDropdown.Item>
                  </NavDropdown>


                  {/* <li >
                    <Link href="/ticket_list" className="nav-link">Ticket Booking List</Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link href="/parcel_list" className="nav-link">Parcel Booking List</Link>
                  </li> */}

                  <NavDropdown className="nav-item" title={userName} id="collapsible-nav-dropdown">
                    <NavDropdown.Item href="/Change_Password">Change Password</NavDropdown.Item>
                    <NavDropdown.Item href="" onClick={handleLogout}>Log-out
                    </NavDropdown.Item>
                  </NavDropdown>


                </ul>
              </Nav>

            </Navbar.Collapse>





          </div>

        </Navbar>

      </div >

    </>
  )
}

export default Header