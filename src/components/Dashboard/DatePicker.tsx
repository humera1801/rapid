import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import date from '@/app/Api/FireApis/DataFilter/date';

interface DateRangePickerProps {
    setRecords: (data: any) => void;
    setfireRecords: (data: any) => void;
    setcabRecords: (data: any) => void;
    setparcelRecords: (data: any) => void;
    setpieChart: (data: any) => void;
    setpieprintdata: (data: any) => void;

}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ setRecords, setfireRecords, setcabRecords, setparcelRecords, setpieChart , setpieprintdata }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [originalRecords, setOriginalRecords] = useState<any>([]);
    const toggleCalendar = () => setIsOpen(!isOpen);

    const handlefilterdate = async (startdate: string, enddate: string) => {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                alert('End date must be greater than start date');
                setEndDate('');
                return end;
            }

            if (start.getTime() === end.getTime()) {
                alert('Start date and end date cannot be the same');
                return;
            }

            const response = await date.getTotalticketbooking(startDate, endDate);
            const firedata = await date.getTotalfirebooking(startDate, endDate);
            const parceldata = await date.getTotalparcelbooking(startDate, endDate);
            const cabdata = await date.getTotalcabbooking(startDate, endDate);
            const piedata = await date.getPieChartdata(startDate, endDate);

            const {
                ticket_percentage,
                cab_percentage,
                fire_percentage,
                parcel_percentage,
            } = piedata.data[0];

            const chartData = [
                ticket_percentage,
                parcel_percentage,
                cab_percentage,
                fire_percentage,
            ];

            setpieChart(chartData);
            setRecords(response.data);
            setfireRecords(firedata.data);
            setparcelRecords(parceldata.data)
            setcabRecords(cabdata.data)

        } catch (error) {
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            handlefilterdate(startDate, endDate);
            console.log(startDate);

        } else {
            console.log('Please select both start and end dates.');
        }
    }, [startDate, endDate]);




    const getDateRange = () => {
        const today = new Date();
        const lastMonth = new Date();
        const TillDate = new Date(today);

        lastMonth.setMonth(today.getMonth() - 1);

        TillDate.setDate(today.getDate() + 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        return {
            startDate: formatDate(lastMonth),
            endDate: formatDate(TillDate),
        };
    };

    useEffect(() => {
        const today = new Date();
        const lastMonth = new Date();
        const TillDate = new Date(today);

        lastMonth.setMonth(today.getMonth() - 1);

        TillDate.setDate(today.getDate() + 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        setStartDate(formatDate(lastMonth));
        setEndDate(formatDate(TillDate));

    }, []);



    const fetchAllData = async () => {
        const { startDate, endDate } = getDateRange();

        try {
            const ticketdata = await date.getTotalticketbooking(startDate, endDate);
            const firedata = await date.getTotalfirebooking(startDate, endDate);
            const parceldata = await date.getTotalparcelbooking(startDate, endDate);
            const cabdata = await date.getTotalcabbooking(startDate, endDate);
            const piedata = await date.getPieChartdata(startDate, endDate);
            setpieprintdata(piedata.data[0])
            console.log("piedata.data" , piedata.data);
            
            const {
                ticket_percentage,
                cab_percentage,
                fire_percentage,
                parcel_percentage,
                ticket_paid_amount,
                cab_paid_amount,
                fire_paid_amount,
                parcel_paid_amount,
            } = piedata.data[0];
            
            // Prepare chart data
            const chartData = [
                { percentage: parseFloat(ticket_percentage), paidAmount: ticket_paid_amount },
                { percentage: parseFloat(parcel_percentage), paidAmount: parcel_paid_amount },
                { percentage: parseFloat(cab_percentage), paidAmount: cab_paid_amount },
                { percentage: parseFloat(fire_percentage), paidAmount: fire_paid_amount },
            ];
            console.log("chartdata" , chartData);

            setpieChart(chartData);
            setRecords(ticketdata.data);
            setfireRecords(firedata.data);
            setparcelRecords(parceldata.data)
            setcabRecords(cabdata.data)
            console.log(".....", cabdata.data);


            // setOriginalRecords(data.data)

        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);


    const handleClearFilter = async () => {
        setStartDate('');
        setEndDate('');

        try {
            const data = await date.getTotalticketbooking();
            const firedata = await date.getTotalfirebooking();
            const parceldata = await date.getTotalparcelbooking();
            const cabdata = await date.getTotalcabbooking();
            const piedata = await date.getPieChartdata(startDate, endDate);

            const {
                ticket_percentage,
                
                cab_percentage,
                fire_percentage,
                parcel_percentage,
            } = piedata.data[0];

            const chartData = [
                ticket_percentage,
                
                parcel_percentage,
                cab_percentage,
                fire_percentage,
            ];

            setpieChart(chartData);
            console.log(chartData, "..........................");

            setRecords(data.data);
            setfireRecords(firedata.data);
            setparcelRecords(parceldata.data)
            setcabRecords(cabdata.data)
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
            const data = await date.getTotalticketbooking(today);
            const firedata = await date.getTotalfirebooking(today);
            const parceldata = await date.getTotalparcelbooking(today);
            const cabdata = await date.getTotalcabbooking(today);
            const piedata = await date.getPieChartdata(startDate, endDate);

            const {
                ticket_percentage,
                cab_percentage,
                fire_percentage,
                parcel_percentage,
            } = piedata.data[0];

            const chartData = [
                ticket_percentage,
                parcel_percentage,
                cab_percentage,
                fire_percentage,
            ];

            setpieChart(chartData);
            setRecords(data.data);
            setfireRecords(firedata.data);
            setparcelRecords(parceldata.data)
            setcabRecords(cabdata.data)
            console.log('Filtered data for today:', data.data);
        } catch (error) {
            console.error('Error fetching filtered data for today:', error);
        }
    };


    return (
        <div className="date-filter-container">
            <div className="button-container">
                <button className="filter-toggle-btn" onClick={toggleCalendar}>
                    <FontAwesomeIcon icon={faFilter} /> Filter
                </button>
                <button onClick={handleTodayList} className="add-toggle-btn">
                    Today List
                </button>
            </div>

            {isOpen && (
                <div className="calendar-popup">

                    <div className="date-inputs">
                        <label className="date-label">Start Date:</label>
                        <div className="date-fields">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="date-input"
                            />
                            <label className="date-label">End Date:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="date-input"
                            />
                            <button className="btn clear-button" onClick={handleClearFilter}>
                                <FontAwesomeIcon icon={faBan} />
                            </button>
                        </div>
                    </div>



                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
