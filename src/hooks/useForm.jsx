import { useState } from "react";

export const useForm = (initialState) => {
    const resetValues = initialState;
    const [values, setValues] = useState(initialState);
    const [error, setError] = useState({});

    // Maneja eventos
    const handleInputChange = (e, name) => {
        let target;
        let value;

        if (!e.target) {
            target = e.originalEvent?.target;
            value = e.checked !== undefined ? e.checked : e.value;
        } else {
            target = e.target;
            value = e.checked !== undefined ? e.checked : e.target.value;
        }

        const key = name ?? target.name;

        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    
    const handleChange = (value, name) => {
        if (!name) return;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setNumber = (e, name) => {
        let target;
        let value;

        if (!e.target) {
            target = e.originalEvent?.target;
            value = e.value;
        } else {
            target = e.target;
            value = e.target.value;
        }

        const key = name ?? target.name;
        const numberValue = parseFloat(value);
        setValues((prev) => ({
            ...prev,
            [key]: isNaN(numberValue) ? 0.0 : numberValue,
        }));
    };

    const resetForm = () => {
        setValues(resetValues);
    };

    return {
        values,
        handleInputChange,
        setValues,
        resetForm,
        setNumber,
        handleChange,
        error,
        setError,
    };
};