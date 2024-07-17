import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import GetUnit from '@/app/Api/FireApis/FireExtinghsherList/GetUnit';

interface FormData {
    feitId: number | null;
    Capacity: {
        fec_capacity: string;
        fec_unit: string | Unit; // Allow for both string and Unit type
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
    const [newUnit, setNewUnit] = useState<string>('');
    const [showNewUnitInput, setShowNewUnitInput] = useState<boolean[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await GetUnit.getunitdata();
            setCapacity(response);
            console.log("unit", response);
            setShowNewUnitInput(response.map(() => false)); // Initialize showNewUnitInput array
        } catch (error) {
            console.error('Error fetching units:', error);
        }
    };

    const { register, control, handleSubmit, reset, setValue } = useForm<FormData>({
        defaultValues: {
            Capacity: [{ fec_capacity: "", fec_unit: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'Capacity',
    });

    const addRow = () => {
        append({ fec_capacity: "", fec_unit: "" });
        setShowNewUnitInput(prev => [...prev, false]); // Add a new entry in showNewUnitInput array
    };

    const handleRemove = (index: number) => {
        remove(index);
        setShowNewUnitInput(prev => prev.filter((_, i) => i !== index)); // Remove corresponding entry in showNewUnitInput array
    };

    const handleUnitChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue === 'add_new_unit') {
            setShowNewUnitInput(prev => prev.map((item, idx) => idx === index ? true : item)); // Show input field for the specific index
        } else {
            setShowNewUnitInput(prev => prev.map((item, idx) => idx === index ? false : item)); // Hide input field for the specific index
        }
        setValue(`Capacity.${index}.fec_unit`, selectedValue);
    };

    const addNewUnit = (index: number) => {
        if (newUnit.trim() !== '') {
            const newUnitObj: Unit = {
                unit_id: capacity.length + 1, // Generate a unique ID (you may need a better method)
                unit_type: newUnit.trim()
            };
            setCapacity(prevCapacity => [...prevCapacity, newUnitObj]);
            setValue(`Capacity.${index}.fec_unit`, newUnitObj); // Assign new unit object to the specific field
            setNewUnit(''); // Clear input field after adding
            setShowNewUnitInput(prev => prev.map((item, idx) => idx === index ? false : item)); // Hide input field after adding
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        try {
            const dataToSubmit = {
                feit_id: feitId,
                capacity: formData.Capacity.map(item => ({
                    fec_capacity: item.fec_capacity,
                    fec_unit: typeof item.fec_unit === 'string' ? item.fec_unit : item.fec_unit.unit_type
                }))
            };

            const response = await axios.post('http://192.168.0.111:3001/capacity/add_fire_extingusher_capacity_data', dataToSubmit);
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
                                    onChange={(e) => handleUnitChange(index, e)}
                                >
                                    <option value="">--Select--</option>
                                    {capacity.map((unit) => (
                                        <option key={unit.unit_id} value={unit.unit_type}>{unit.unit_type}</option>
                                    ))}
                                    <option value="add_new_unit">Add New Unit</option>
                                </select>
                                {showNewUnitInput[index] && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Enter New Unit"
                                            value={newUnit}
                                            onChange={(e) => setNewUnit(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm mt-2"
                                            onClick={() => addNewUnit(index)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
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
                    <br/>
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