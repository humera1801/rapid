    "use client";

    import { Suspense, useState, useEffect } from "react";
    import AuthProvider from '@/components/Dashboard/AuthProvider';
    import Header from '@/components/Dashboard/Header';
    import LoadingSpinner from '@/components/Loading/BusLoader';
    import TicketBook from "@/components/Ticket/BusTIcket";

    const page = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        }, 1000); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
        <AuthProvider>
            <Suspense fallback={<LoadingSpinner />}>
            {loading ? <LoadingSpinner /> : <TicketBook />}
            </Suspense>
        </AuthProvider>
        </>
    );
    };

    export default page;
