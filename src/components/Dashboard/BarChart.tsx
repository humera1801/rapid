import React, { useEffect, useState } from 'react';
import 'chart.js/auto';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import date from '@/app/Api/FireApis/DataFilter/date';
ChartJS.register(ArcElement, Tooltip, Legend);

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});


const BarChart = () => {
    const [ticketlinechart, setticketRecords] = useState<any[]>([]);
    const [parcellinechart, setparcelRecords] = useState<any[]>([]);
    const [cablinechart, setcabRecords] = useState<any[]>([]);
    const [firelinechart, setfireRecords] = useState<any[]>([]);


    const fetchAllData = async () => {

        try {
            const linechart = await date.getLineChartdata();
            const ticketdata = linechart.data.ticket_booking;
            const parceldata = linechart.data.courier_booking;
            const cabdata = linechart.data.cab_booking;
            const firedata = linechart.data.fire_extinguisher_booking;

            setticketRecords(ticketdata);
            setparcelRecords(parceldata);
            setcabRecords(cabdata);
            setfireRecords(firedata);

            console.log("line chart", ticketdata);

        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);









    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Ticket Booking',
                data: ticketlinechart.length > 0 ? ticketlinechart : [],
                backgroundColor: 'rgb(208, 90, 54)',
                borderColor: 'rgb(208, 90, 54)',
                tension: 0.1,
                fill: false,
            },
            {
                label: 'Parcel Booking',
                data: parcellinechart.length > 0 ? parcellinechart : [],
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
                fill: false,
            },
            {
                label: 'Cab Booking',
                data: cablinechart.length > 0 ? cablinechart : [],
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false,
            },
            {
                label: 'Fire Extinguisher',
                data: firelinechart.length > 0 ? firelinechart : [],
                backgroundColor: 'rgb(78, 102, 102)',
                borderColor: 'rgb(25, 100, 102)',
                tension: 0.1,
                fill: false,
            }
        ],
    };

    return (
        <>
            <div>
                <Line data={data} />
            </div>
        </>
    );
};

export default BarChart;
