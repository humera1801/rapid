import React, { useEffect, useState } from 'react'
import "./Home.css"
import "../../../public/css/style.css"
import 'chart.js/auto';
import dynamic from 'next/dynamic';

import BarChart from './BarChart';
import PieChart from './PieChart';
import date from '@/app/Api/FireApis/DataFilter/date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import DateRangePicker from './DatePicker';
import ParcelListPage from '../Parcel/ParcelList';
import PaymentList from './DashboardPaymentList';
import TicketList from '../Ticket/TicketList';
import VendorDashboardList from './VendorDashboardList';
import Link from 'next/link';


interface HomepageProps {
    records: any[];
    firerecords: any[];
    parcelrecords: any[];
    cabrecords: any[];
    pieChart: any[];
    pieprintdata: any[];

}


const Homepage: React.FC<HomepageProps> = () => {


    const [records, setRecords] = useState<any[]>([]);
    const [firerecords, setfireRecords] = useState<any[]>([]);
    const [parcelrecords, setparcelRecords] = useState<any[]>([]);
    const [cabrecords, setcabRecords] = useState<any[]>([]);
    const [pieChart, setpieChart] = useState<any[]>([]);
    const [pieprintdata, setpieprintdata] = useState<any[]>([]);



   
    return (
        <>



            <div className="container box my-4">
              
                <div className="date-filter d-flex align-items-center justify-content-end mb-4 custom-date-filter">
                    <DateRangePicker setRecords={setRecords} setfireRecords={setfireRecords} setparcelRecords={setparcelRecords} setcabRecords={setcabRecords} setpieChart={setpieChart} setpieprintdata={setpieprintdata} />


                </div>



                <div className="row justify-content-center">
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                        <div className="stat-card p-4">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-red me-4">
                                    <img
                                        src="/img/bus_01.png"
                                        className="card-img-top icon-size "
                                        alt="Employee"
                                    />
                                </div>
                                <Link href="/ticket_list" style={{ textDecoration: "none", color: "black" }}>
                                    <div>
                                        <h6>Bus Ticket</h6>
                                        <h4>{records}</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                        <div className="stat-card p-4">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-red me-4">
                                    <img
                                        src="/img/parcel.png"
                                        className="card-img-top icon-size "
                                        alt="Employee"
                                    />
                                </div>
                                <Link href="/parcel_list" style={{ textDecoration: "none", color: "black" }}>
                                    <div>
                                        <h6>Parcel</h6>
                                        <h4>{parcelrecords}</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                        <div className="stat-card p-4">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-red me-4">
                                    <img
                                        src="/img/car_01.png"
                                        className="card-img-top icon-size "
                                        alt="Employee"
                                    />
                                </div>
                                <Link href="/CabBooking/CabList" style={{ textDecoration: "none", color: "black" }}>
                                    <div>
                                        <h6>Cab</h6>
                                        <h4>{cabrecords}</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                        <div className="stat-card p-4">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-white me-4">
                                    <img
                                        src="/img/fire_extinguisher.png"
                                        className="card-img-top icon-size "
                                        alt="Employee"
                                    />
                                </div>
                                <Link href="/Fire/Fire-List" style={{ textDecoration: "none", color: "black" }}>
                                    <div>
                                        <h6>Fire Extinguisher</h6>
                                        <h4>{firerecords}</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row equal-height  mt-4">

                    <div className="col-lg-8 abc d-flex align-items-stretch" >
                        <div className="abc-stat-card w-100 p-4">
                            <BarChart />
                        </div>
                    </div>
                    <div className="col-lg-4 abc d-flex align-items-stretch" >
                        <div className="abc-stat-card w-100 p-4">
                            <PieChart data={pieChart} pieprintdata={pieprintdata} />
                        </div>
                    </div>
                </div>
                <div className="row equal-height  mt-4">
                    <div className="col-lg-6" >

                        <div className="abc-stat-card  p-4">
                            <ParcelListPage />
                        </div>
                    </div>
                    <div className="col-lg-6" >

                        <div className="abc-stat-card  p-4">
                            <TicketList />
                        </div>
                    </div>
                </div>
                <div className="row equal-height  mt-4">
                    <div className="col-lg-6" >

                        <div className="abc-stat-card  p-4">
                            <PaymentList />                    </div>
                    </div>
                    <div className="col-lg-6" >

                        <div className="abc-stat-card  p-4">
                            <VendorDashboardList />                    </div>
                    </div>
                </div>
            </div>




        </>
    )
}

export default Homepage