import React, { useEffect, useState } from 'react';
import 'chart.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import date from '@/app/Api/FireApis/DataFilter/date';

interface PieChartProps {
    data: any[];
    pieprintdata: any;
}
const PieChart: React.FC<PieChartProps> = ({ data, pieprintdata }) => {

    console.log(data);


    const piedata = {
        labels: ["Ticket", "Parcel", "Cab", "Fire-Extinguisher"],
        datasets: [
            {
                data: data.length > 0 ? data : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.3)',
                    'rgba(34, 52, 7, 0.3)',
                    'rgba(208, 90, 54, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>

            <Pie data={piedata} />
            <div className="row"
                style={{

                    bottom: '10px',
                    right: '10px',
                    fontSize: '10px',
                    textAlign: 'right'
                }}>
                {/* <div className="col">
                    <div>ticket Amount: <span>{pieprintdata.ticket_paid_amount}</span></div>
                    <div>parcel Amount: <span>{pieprintdata.parcel_paid_amount}</span> </div>
                    <div>cab Amount :  <span>{pieprintdata.cab_paid_amount}</span></div>
                    <div>fire Amount : <span>{pieprintdata.fire_paid_amount}</span></div>
                </div> */}
            </div>
        </div>
    );
};

export default PieChart;
