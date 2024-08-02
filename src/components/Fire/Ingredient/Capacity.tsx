import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import GetUnit from '@/app/Api/FireApis/FireExtinghsherList/GetUnit';

interface FormData {
  
    feitId: number | null;
    Capacity: {
        fec_capacity: string;
        fec_unit: string;
    }[];
}
interface Unit {
    unit_id: number;
    unit_type: string;
}
interface CapacityProps {
    show: boolean;
    onHide: () => void;
    feitId: number | null;
    capacityData: any[]; // Adjust type as per actual data structure
}

const Capacity: React.FC<CapacityProps> = ({ show, onHide, feitId, capacityData }) => {



    const [capacity, setCapacity] = useState<Unit[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await GetUnit.getunitdata();
            setCapacity(response);
            console.log("unit", response);
        } catch (error) {
            console.error('Error fetching units:', error);
        }
    };










    const { register, control, handleSubmit, reset, setValue } = useForm<FormData>({
        defaultValues: {
           
            Capacity: [{ fec_capacity: "", fec_unit: "" }]
            // Capacity: capacityData.map(item => ({
            //     fec_capacity: item.fec_capacity,
            //     fec_unit: item.fec_unit
            // }))
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'Capacity',
    });

    const addRow = () => {
        append({ fec_capacity: "", fec_unit: "" });
    };

    const handleRemove = (index: number) => {
        remove(index);
    };

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        try {
            const dataToSubmit = {
                feit_id: feitId,
                capacity: formData.Capacity
            };

            const response = await axios.post('http://192.168.0.105:3001/capacity/add_fire_extingusher_capacity_data', dataToSubmit);
            console.log('Data submitted successfully:', response.data);
            reset(); // Reset the form fields to default values
            onHide(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

  
    useEffect(() => {
        if (capacityData && capacityData.length > 0) {
            reset({
                feitId: feitId,
                Capacity: capacityData.map(item => ({
                    fec_capacity: item.fec_capacity,
                    fec_unit: item.fec_unit
                }))
            });
        } else {
            reset({
                feitId: feitId,
                Capacity: [{ fec_capacity: "", fec_unit: "" }]
            });
        }
    }, [feitId, capacityData, reset]);
    

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Item Capacity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Render dynamic fields */}
                    {fields.map((field, index) => (                        
                        <div key={field.id} className="row mb-3">
                            <>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor={`capacity-${index}`}>Add Capacity:</label>
                                <input
                                    {...register(`Capacity.${index}.fec_capacity`)}
                                    className="form-control form-control-sm"
                                    type="text"
                                    id={`capacity-${index}`}
                                    placeholder="Enter Capacity here"
                                />
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-4">
                                <label className="form-label" htmlFor={`unit-${index}`}>Select Unit:</label>
                                <select
                                    className="form-control form-control-sm"
                                    {...register(`Capacity.${index}.fec_unit`, {
                                        required: true,
                                    })}
                                    id={`unit-${index}`}
                                >
                                    <option value="">--Select--</option>
                                    {/* Render options based on capacityData */}
                                    {capacity.map((unit) => (
                                            <option key={unit.unit_id} value={unit.unit_type}>{unit.unit_type}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="col-lg-1" style={{ marginTop: "30px" }}>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemove(index)}
                                >
                                    <FontAwesomeIcon icon={faMinusCircle} />
                                </button>
                            </div>
                            </>
                        </div>
                    ))}
                    {/* Button to add a new row (field) */}
                    <div className="row">
                        <div className="col-12">
                            <button
                                type="button"
                                style={{ float: "right", marginRight: "14px" }}
                                onClick={addRow}
                                className="btn btn-primary btn-sm"
                            >
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </button>
                        </div>
                    </div>
                    <br />
                    {/* Submit button */}
                    <Modal.Footer>
                        <Button type='submit' style={{ marginLeft: "10px" }}>Update</Button>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default Capacity;
