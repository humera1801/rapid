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
                  <li >
                    <Link href="/Home" className="nav-link">Home</Link>
                  </li>
                  {/* <NavDropdown title="Fire Extinguisher" id="basic-nav-dropdown">
                    <NavDropdown.Item as="div">
                      <Link className="nav-link" href="/Fire/Fire-Extinguisher">
                        Fire Extinguisher Book
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/Fire/Fire-Extinguisher">   Brand  </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3"> Ingredient</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Service</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Fire  List</NavDropdown.Item>
                   
                  </NavDropdown> */}
                  <li >
                    <Link href="/Fire/Fire-Extinguisher" className="nav-link">Fire Extinguisher</Link>
                  </li>
                  <li >
                    <Link href="/Fire/Add-Brand" className="nav-link">Brand List</Link>
                  </li>
                  <li >
                    <Link href="/Fire/Add-Ingredient" className="nav-link">Ingredient List</Link>
                  </li>
                  <li >
                    <Link href="/Fire/Add-Service" className="nav-link">Service List</Link>
                  </li>
                  <li >
                    <Link href="/Fire/Fire-List" className="nav-link">Fire  List</Link>
                  </li>
                  <li >
                    <Link href="/ticket_list" className="nav-link">Ticket Booking List</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/parcel_list" className="nav-link">Parcel Booking List</Link>
                  </li>

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