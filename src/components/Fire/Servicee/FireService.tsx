import DeleteService from '@/app/Api/FireApis/ServiceApi/DeleteService';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import servicedataId from '@/app/Api/FireApis/ServiceApi/servicedataId';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

interface FormData {
    fest_id: number,
    fest_name: string,
    fest_created_by: any

}

const FireService = () => {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editservices, setEditServices] = useState<FormData | null>(null);

    const [services, setServices] = useState<FormData[]>([]);
    const storedData = localStorage.getItem('userData');
    // State to hold services
    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            fest_created_by: storedData,
        }
    });
    //----------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await GetServiceList.getService();
            setServices(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };
    //------------------------------------------------------------------------------------------------------------------------------

    const onSubmit = async (FormData: any) => {
        console.log("form data", FormData);

        try {
            const response = await axios.post('http://192.168.0.106:3001/service/add_fire_extinguisher_service_type', FormData);

            console.log('service added successfully:', response.data);

            await fetchData();

            reset();


            setModalShow(false);
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };


    const handleEdit = async (id: number) => {
        try {
            const response = await servicedataId.getServiceId(id.toString()); // Fetch brand details


            setEditServices(response.data[0]);
            setEditModalShow(true); // Open the edit modal
            reset();
        } catch (error) {
            console.error('Error fetching brand details:', error);
        }
    };
    const handleEditSubmit = async (FormData: any) => {
        console.log("data", FormData)
        try {
            if (!editservices) return;
    
            const response = await axios.post('http://192.168.0.106:3001/service/edit_fire_extinguisher_service_type', {
                ...FormData,
                fest_id: editservices.fest_id  // Include the ID of the ingredient being edited
            });
    
            console.log('Ingredient updated successfully:', response.data);
    
            await fetchData();  // Refresh ingredient list
    
            reset();  // Reset form state
            setEditModalShow(false);  // Close edit modal
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };


    const handleDelete = async (id: number) => {
        try {
            const response = await DeleteService.deleteservice(id.toString());
            setEditServices(response);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };
    const handleDeleteClick = (id: number) => {
        if (window.confirm('Are you sure you want to delete this Service?')) {
            handleDelete(id);
        }
    };
    return (
        <>
            <div className='container-fluid'>
                <br />
                <Card>
                    <Card.Header><label style={{ fontSize: "30px", fontWeight: "500" }}>Fire extinguisher Service List</label>
                        <button style={{ float: "right", marginTop: "6px" }} onClick={() =>  { reset(); setModalShow(true) }} className="btn btn-primary btn-sm">Add New Service</button></Card.Header>
                    <Card.Body>
                        {/* Add New Service Modal */}
                        <Modal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Add New Service
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row mb-3">
                                        <div className="col-lg-4">
                                            <label className="form-label" htmlFor="service" >Service Name</label>
                                            <input
                                                {...register('fest_name')}
                                                className="form-control"
                                                type='text'
                                                id='service'
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Modal.Footer>
                                        <Button type='submit'>Add</Button>
                                    </Modal.Footer>
                                </form>
                            </Modal.Body>
                        </Modal>
                        {/* Edit New Service Modal */}
                        <Modal show={editModalShow} onHide={() => setEditModalShow(false)} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Brand</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit(handleEditSubmit)}>
                                <div className="row mb-3">
                                    {editservices && (
                                        <div className="col-lg-4">
                                            <label className="form-label" htmlFor="edit_brand_name">Brand Name</label>
                                            <input
                                                {...register('fest_name')}
                                                className="form-control"
                                                type='text'
                                                id='edit_brand_name'
                                                defaultValue={editservices?.fest_name} // Use defaultValue to pre-fill input
                                                onChange={(e) => setEditServices({ ...editservices, fest_name: e.target.value })} // Update editBrand on change
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <Modal.Footer>
                                    <Button type='submit'>Update</Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Body>
                    </Modal>


                        <div className="row mb-3">
                            <div className="col-lg-12">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th className="col-lg-2" scope="col">Id</th>
                                            <th className="col-lg-8" scope="col">Service Name</th>
                                            <th className="col-lg-2" scope="col">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services && services.length > 0 && services.map((service, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{service.fest_name}</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleEdit(service.fest_id)}>Edit</button>
                                                    <button type="button" className="btn btn-danger btn-sm ms-1"onClick={() => handleDeleteClick(service.fest_id)}  >Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default FireService;
