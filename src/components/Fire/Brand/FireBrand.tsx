import React, { useEffect, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import DeleteBrand from '@/app/Api/FireApis/BrandApi/DeleteBrand';
import GetBrandID from '@/app/Api/FireApis/BrandApi/GetBrandID';


interface FormData {
    brand_name: string;
}

interface Brand {
    feb_id: number;
    feb_name: string;
}

const FireBrand = () => {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);

    const { register, handleSubmit, reset } = useForm<FormData>();
    const storedData = localStorage.getItem('userData');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await GetNewBrand.getAddBrand();
            setBrands(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post('http://192.168.0.106:3001/brand/add_new_fire_brand', {
                brand_name: data.brand_name,
                created_by: storedData,
            });

            console.log('Brand added successfully:', response.data);

            await fetchData();

            reset();
            setModalShow(false);
        } catch (error) {
            console.error('Error adding brand:', error);
        }
    };


    const handleEdit = async (id: number) => {
        try {
            const response = await GetBrandID.getFireBrandIdData(id.toString());
            const { feb_id, feb_name } = response.data[0];
            console.log('feb_id:', feb_id);
            console.log('feb_name:', feb_name);

            setEditBrand(response.data[0]);
            setEditModalShow(true);
            reset();
        } catch (error) {
            console.error('Error fetching brand details:', error);
        }
    };

    const handleEditSubmit = async (data: FormData) => {
        console.log("data", data)
        try {
            if (!editBrand) return;

            const response = await axios.post('http://192.168.0.106:3001/brand/edit_fire_brand_name', {
                feb_id: editBrand.feb_id,
                feb_name: data.brand_name,
                created_by: storedData,
            });
            console.log('Brand updated successfully:', editBrand.feb_id);

            console.log('Brand updated successfully:', response.data);

            await fetchData();

            reset();
            setEditModalShow(false);
        } catch (error) {
            console.error('Error updating brand:', error);
        }
    };
    const handleDelete = async (id: number) => {
        try {
            const response = await DeleteBrand.deleteBrand(id.toString());
            setEditBrand(response);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };
    const handleDeleteClick = (id: number) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            handleDelete(id);
        }
    };
    return (
        <div className='container-fluid'>
            <br />
            <Card>
                <Card.Header>
                    <div className="col-12">
                        <label style={{ fontSize: "30px", fontWeight: "500" }}>Fire extinguisher brand List</label>
                        <button style={{ float: "right", marginTop: "6px" }} onClick={() => { reset(); setModalShow(true) }} className="btn btn-primary btn-sm">Add New Brand</button>
                    </div>
                </Card.Header>
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
                                Add New Brand
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="brand_name">Brand Name</label>
                                        <input
                                            {...register('brand_name')}
                                            className="form-control"
                                            type='text'
                                            id='brand_name'
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

                    {/* Edit Brand Modal */}
                    <Modal show={editModalShow} onHide={() => setEditModalShow(false)} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Brand</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit(handleEditSubmit)}>
                                <div className="row mb-3">
                                    {editBrand && (
                                        <div className="col-lg-4">
                                            <label className="form-label" htmlFor="edit_brand_name">Brand Name</label>
                                            <input
                                                {...register('brand_name')}
                                                className="form-control"
                                                type='text'
                                                id='edit_brand_name'
                                                defaultValue={editBrand?.feb_name} // Use defaultValue to pre-fill input
                                                onChange={(e) => setEditBrand({ ...editBrand, feb_name: e.target.value })} // Update editBrand on change
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


                    {/* Brand List */}
                    <div className="row mb-3">
                        <div className="col-lg-12">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="col-lg-2" scope="col">Id</th>
                                        <th className="col-lg-8" scope="col">Brand Name</th>
                                        <th className="col-lg-2" scope="col">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands && brands.length > 0 && brands.map((brand, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{brand.feb_name}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleEdit(brand.feb_id)}>Edit</button>
                                                <button type="button" className="btn btn-danger btn-sm ms-1" onClick={() => handleDeleteClick(brand.feb_id)}>Delete</button>
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

export default FireBrand;
