import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import DeleteIngrdieant from '@/app/Api/FireApis/IngredientApi/DeleteIngrdieant';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import IngredientsDataId from '@/app/Api/FireApis/IngredientApi/IngredientsDataId';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Capacity from './Capacity';

interface FormData {
  
    feit_id: number;
    feit_name: string;
    feit_hsn_code: string;
    feit_rate: string;
    feit_sgst: any;
    feit_cgst: any;
    feit_created_by: any;
    capacity:[]
}

const FireIngredient = () => {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [ingredients, setIngredients] = useState<FormData[]>([]);
    const [editingredients, setEditingredients] = useState<FormData | null>(null);
    // const [capacitymodalShow, setcapacityModalShow] = useState(false);
    const storedData = localStorage.getItem('userData');

    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            feit_created_by: storedData,
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await GetIngredientList.getIngrediant();
            setIngredients(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const onSubmit = async (FormData: any) => {
        try {
            const response = await axios.post('http://192.168.0.111:3001/ingredient/add_new_ingredient_type', FormData);
            console.log('Ingredient added successfully:', response.data);
            await fetchData();
            reset();
           
            setModalShow(false);
            window.location.reload();
        } catch (error) {
            console.error('Error adding brand:', error);
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const response = await IngredientsDataId.getIngredientsIdData(id.toString());
            setEditingredients(response.data[0]);
            setEditModalShow(true);
            reset();
        } catch (error) {
            console.error('Error fetching brand details:', error);
        }
    };

    const handleEditSubmit = async (FormData: any) => {
        try {
            if (!editingredients) return;
            const response = await axios.post('http://192.168.0.111:3001/ingredient/edit_fire_ingredient_data', {
                ...FormData,
                feit_id: editingredients.feit_id
            });
            console.log('Ingredient updated successfully:', response.data);
            await fetchData();
            reset();
            setEditModalShow(false);
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await DeleteIngrdieant.deleteIngredient(id.toString());
            setEditingredients(response);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Are you sure you want to delete this Ingredient?')) {
            handleDelete(id);
        }
    };

    const [feitId, setFeitId] = useState<number | null>(null);
    const [capacityData, setCapacityData] = useState<any[]>([]); // State to store capacity data
    const [capacityModalShow, setCapacityModalShow] = useState(false); // State for modal visibility

    const handleCapacityEdit = async (id: number) => {
        try {
          
            const response = await IngredientsDataId.getIngredientsIdData(id.toString()); // Assuming this method exists in IngredientsDataId
            if (response.data) {
                setFeitId(response.data.feit_id); // Set feit_id from API response
                setCapacityData(response.data.capacity); // Set capacity data from API response
                setCapacityModalShow(true); // Show the modal
            }
        } catch (error) {
            console.error('Error fetching ingredient details:', error);
        }
    };
    return (
        <>
            <div className='container-fluid'>
                <br />
                <Card>
                    <Card.Header>
                        <label style={{ fontSize: "30px", fontWeight: "500" }}>Fire extinguisher Ingredient List</label>
                        <button style={{ float: "right", marginTop: "6px" }} onClick={() => setModalShow(true)} className="btn btn-primary btn-sm">Add New Data</button>
                    </Card.Header>
                    <Card.Body>
                        <Modal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Add New Ingredient
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row mb-3">
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="ingredient_name">Ingredient Name</label>
                                            <input
                                                {...register('feit_name')}
                                                className="form-control"
                                                type='text'
                                                id='ingredient_name'
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="Hsn_code">Hsn Code</label>
                                            <input
                                                {...register('feit_hsn_code')}
                                                className="form-control"
                                                type='text'
                                                id='Hsn_code'
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor="rate">Rate</label>
                                            <input
                                                {...register('feit_rate')}
                                                className="form-control"
                                                type='text'
                                                id='rate'
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor="sgst">SGST</label>
                                            <input
                                                {...register('feit_sgst')}
                                                className="form-control"
                                                type='text'
                                                id='sgst'
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor="cgst">CGST</label>
                                            <input
                                                {...register('feit_cgst')}
                                                className="form-control"
                                                type='text'
                                                id='cgst'
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

                        <Modal show={editModalShow} onHide={() => setEditModalShow(false)} size="lg" centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Brand</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(handleEditSubmit)}>
                                    {editingredients && (
                                        <div className="row mb-3">
                                            <div className="col-lg-3">
                                                <label className="form-label" htmlFor="ingredient_name">Ingredient Name</label>
                                                <input
                                                    {...register('feit_name')}
                                                    className="form-control"
                                                    type='text'
                                                    value={editingredients?.feit_name}
                                                    onChange={(e) => setEditingredients({ ...editingredients, feit_name: e.target.value })}
                                                    id='ingredient_name'
                                                    required
                                                />
                                            </div>
                                            <div className="col-lg-3">
                                                <label className="form-label" htmlFor="Hsn_code">Hsn Code</label>
                                                <input
                                                    {...register('feit_hsn_code')}
                                                    className="form-control"
                                                    type='text'
                                                    value={editingredients?.feit_hsn_code}
                                                    onChange={(e) => setEditingredients({ ...editingredients, feit_hsn_code: e.target.value })}
                                                    id='Hsn_code'
                                                    required
                                                />
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="form-label" htmlFor="rate">Rate</label>
                                                <input
                                                    {...register('feit_rate')}
                                                    className="form-control"
                                                    type='text'
                                                    value={editingredients?.feit_rate}
                                                    onChange={(e) => setEditingredients({ ...editingredients, feit_rate: e.target.value })}
                                                    id='rate'
                                                    required
                                                />
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="form-label" htmlFor="sgst">SGST</label>
                                                <input
                                                    {...register('feit_sgst')}
                                                    className="form-control"
                                                    type='text'
                                                    value={editingredients?.feit_sgst}
                                                    onChange={(e) => setEditingredients({ ...editingredients, feit_sgst: e.target.value })}
                                                    id='sgst'
                                                    required
                                                />
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="form-label" htmlFor="cgst">CGST</label>
                                                <input
                                                    {...register('feit_cgst')}
                                                    className="form-control"
                                                    type='text'
                                                    value={editingredients?.feit_cgst}
                                                    onChange={(e) => setEditingredients({ ...editingredients, feit_cgst: e.target.value })}
                                                    id='cgst'
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <Modal.Footer>
                                        <Button type='submit'>Update</Button>
                                    </Modal.Footer>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Capacity Modal */}
                        <Capacity
                show={capacityModalShow}
                onHide={() => setCapacityModalShow(false)}
                feitId={feitId}
                capacityData={capacityData}
            />

                        <div className="row mb-3">
                            <div className="col-lg-12">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th className="col-lg-1" scope="col">Id</th>
                                            <th className="col-lg-2" scope="col">Ingredient Name</th>
                                            <th className="col-lg-2" scope="col">Capacity</th>
                                            <th className="col-lg-2" scope="col">Hsn Code</th>
                                            <th className="col-lg-1" scope="col">Rate</th>
                                            <th className="col-lg-1" scope="col">SGST</th>
                                            <th className="col-lg-1" scope="col">CGST</th>
                                            <th className="col-lg-3" scope="col">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingredients && ingredients.length > 0 && ingredients.map((ingredient, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{ingredient.feit_name}</td>
                                                <td>{ingredient.capacity.join(', ')}</td>
                                                <td>{ingredient.feit_hsn_code}</td>
                                                <td>{ingredient.feit_rate}</td>
                                                <td>{ingredient.feit_sgst}</td>
                                                <td>{ingredient.feit_cgst}</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleEdit(ingredient.feit_id)}>Edit</button>
                                                    <button type="button" className="btn btn-danger btn-sm ms-1" onClick={() => handleDeleteClick(ingredient.feit_id)}>Delete</button>
                                                    <button type="button" className="btn btn-success btn-sm ms-1" onClick={() => handleCapacityEdit(ingredient.feit_id)}>Capacity</button>
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

export default FireIngredient;


