import React, { useEffect, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import DeleteBrand from '@/app/Api/FireApis/BrandApi/DeleteBrand';
import GetBrandID from '@/app/Api/FireApis/BrandApi/GetBrandID';
import CabbookingList from '@/app/Api/CabBooking/CabbookingList';


interface FormData {
    v_type: string;
    rate_8_hrs: any;
    rate_12_hrs:any;
    created_by: any;
}

interface Brand {
    v_id: number;
    v_type: any;
    rate_8_hrs: any;
    rate_12_hrs:any;
}

const VehicalList = () => {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [Vehicles, setVehicles] = useState<Brand[]>([]);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const storedData = localStorage.getItem('userData');

    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            created_by: storedData,
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await CabbookingList.getVehicleList();
            setVehicles(response.data);

        } catch (error) {
            console.error('Error fetching Vehicles:', error);
        }
    };

    const onSubmit = async (data: FormData) => {
        console.log('Brand added successfully:', data);

        try {
            const response = await axios.post('http://192.168.0.106:3001/cabbooking/add_vehicle', data);

            console.log('vehicle rate  added successfully:', response.data);

            await fetchData();

            reset();
            setModalShow(false);
        } catch (error) {
            console.error('Error adding vehicle rate', error);
        }
    };


    const handleEdit = async (id: number) => {
        try {
            const response = await CabbookingList.getVehicleIdData(id.toString());
            setEditBrand(response.data[0]);
            // console.log(">>>>>>>>>" , response.data);

            setEditModalShow(true);
            reset();
        } catch (error) {
            console.error('Error fetching vehicle rate details:', error);
        }
    };

    const handleEditSubmit = async (data: FormData) => {
        try {
            if (!editBrand) return;

            const response = await axios.post('http://192.168.0.106:3001/cabbooking/edit_vehicle_data', {
                v_id: editBrand.v_id,
                v_type: data.v_type,
                rate_8_hrs: data.rate_8_hrs,
                rate_12_hrs:data.rate_12_hrs,
                created_by: storedData,
            });
            console.log(data);

            console.log('vehicle updated successfully:', response.data);
            await fetchData();
            reset();
            setEditModalShow(false);
        } catch (error) {
            console.error('Error updating vehicle rate:', error);
        }
    };



    const handleDelete = async (id: number) => {
        try {
            const response = await CabbookingList.deleteVehicle(id.toString());
            setEditBrand(response);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting vehicle rate:', error);
        }
    };
    const handleDeleteClick = (id: number) => {
        if (window.confirm('Are you sure you want to delete this vehicle rate?')) {
            handleDelete(id);
        }
    };
    return (
        <div className='container' style={{ fontSize: "12px" }}>
            <br />

            <div className="col-12">
                <label style={{ fontSize: "25px", fontWeight: "500" }}>Vehicle List</label>
                <button style={{ float: "right", marginTop: "6px" }} onClick={() => setModalShow(true)} className="btn btn-primary btn-sm">Add New Vehicle</button>
            </div>
            <br />
            <Card className='cardbox'>

                <Card.Body>
                    {/* Add New Brand Modal */}
                    <Modal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Add New Vehical
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="v_type">Vehicle Type</label>
                                        <input
                                            {...register('v_type')}
                                            className="form-control"
                                            type='text'
                                            id='v_type'
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label" htmlFor="rate">8 Hrs/80 KMs Rate:</label>
                                        <input
                                            {...register('rate_8_hrs')}
                                            className="form-control"
                                            type='text'
                                            required
                                            id='rate'

                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label" htmlFor="rate">12 Hrs/300 KMs Rate:</label>
                                        <input
                                            {...register('rate_12_hrs')}
                                            className="form-control"
                                            type='text'
                                            required
                                            id='rate'

                                        />
                                    </div>
                                </div>
                                <Modal.Footer>
                                    <Button type='submit'>Add</Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Body>
                    </Modal>

                    {/* Edit Brand Modal */}
                    <Modal show={editModalShow} onHide={() => setEditModalShow(false)} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Vehical</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit(handleEditSubmit)}>
                                <div className="row mb-3">
                                    {editBrand && (
                                        <div className="row mb-3">

                                            <div className="col-lg-4">
                                                <label className="form-label" htmlFor="edit_v_type">Vehicle Type</label>
                                                <input
                                                    {...register('v_type')}
                                                    className="form-control"
                                                    type='text'
                                                    id='edit_v_type'
                                                    defaultValue={editBrand?.v_type}
                                                    onChange={(e) => setEditBrand({ ...editBrand, v_type: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label" htmlFor="rate">8 Hrs/80 KMs Rate:</label>
                                                <input
                                                    {...register('rate_8_hrs')}
                                                    className="form-control"
                                                    type='text'
                                                    defaultValue={editBrand?.rate_8_hrs}
                                                    onChange={(e) => setEditBrand({ ...editBrand, rate_8_hrs: e.target.value })}
                                                    required
                                                    id='rate'

                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label" htmlFor="rate">12 Hrs/300 KMs Rate:</label>
                                                <input
                                                    {...register('rate_12_hrs')}
                                                    className="form-control"
                                                    type='text'
                                                    defaultValue={editBrand?.rate_12_hrs}
                                                    onChange={(e) => setEditBrand({ ...editBrand, rate_12_hrs: e.target.value })}
                                                    required
                                                    id='rate'

                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Modal.Footer>
                                    <Button type='submit'>Update</Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Body>
                    </Modal>


                    {/* Brand List */}
                    <div className="row mb-3">
                        <div className="col-lg-12">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="col-lg-2" scope="col">Id</th>
                                        <th className="col-lg-3" scope="col">vehicle Name</th>
                                        <th className="col-lg-2" scope="col">8 Hrs/80 KMs Rate</th>
                                        <th className="col-lg-2" scope="col">12 Hrs/300 KMs Rate</th>

                                        <th className="col-lg-4" scope="col">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Vehicles && Vehicles.length > 0 && Vehicles.map((vehicle, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{vehicle.v_type}</td>
                                            <td>{vehicle.rate_8_hrs}</td>
                                            <td>{vehicle.rate_12_hrs}</td>

                                            <td>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleEdit(vehicle.v_id)}>Edit</button>
                                                <button type="button" className="btn btn-danger btn-sm ms-1" onClick={() => handleDeleteClick(vehicle.v_id)}>Delete</button>
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
    );
};

export default VehicalList;
