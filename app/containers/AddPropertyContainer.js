import React, { Component } from 'react';
import { getSuburbSuggestions, getSuburbsFromServer, updateSuggestions, updateSuburbSuggestionValue, clearSuburbSuggestions, addProperty } from '../actions/property'
import { reduxForm } from 'redux-form'
import { browserHistory } from 'react-router'
import AddProperty from '../components/AddProperty'

//Client side validation
function validate(values) {
    const errors = {};

    if (!values.price || values.price.trim() === '') {
        errors.price = 'Enter a price.';
    }
    if (!values.address || values.address.trim() === '') {
        errors.address = 'Enter an address.';
    }
    if (!values.propertyType || values.propertyType.trim() === '')
    {
        errors.propertyType = 'Select a property type.'
    }
    if (!values.roomType || values.roomType.trim() === '')
    {
        errors.roomType = 'Select a room type.'
    }
    if (!values.contactName || values.contactName.trim() === '') {
        errors.contactName = 'Enter a contact name.';
    }
    if ((!values.contactNumber || values.contactNumber.trim() === '') &&
        (!values.contactEmail || values.contactEmail.trim() === '') &&
        (!values.contactSocial || values.contactSocial.trim() === ''))
    {
        errors.contactNumber = 'Enter a contact number.';
        errors.contactEmail = 'Enter a contact mail.';
        errors.contactSocial = 'Contact information is required at least one.';
    }

    return errors;
}

const validateAndAddProperty = (values, dispatch) => {
    console.log(values);
    return new Promise((resolve, reject) => {
        dispatch(addProperty(values))
            .then((response) => {
                let data = response.payload.data;
                if (response.payload.status != 200) {
                    reject(data);
                } else {
                    browserHistory.push({
                        pathname: `/property/${response.payload.id}`
                    })
                    resolve();
                }
            })
    })
}

const mapDispatchToProps = (dispatch) => {
    return {
        addProperty: validateAndAddProperty,
        onChange(event, { newValue }) {

            dispatch(updateSuburbSuggestionValue(newValue));

            const value = newValue.trim();
            if (value === '') {
                dispatch(clearSuburbSuggestions());
            }
        },
        onSuggestionsUpdateRequested({ value }) {
            dispatch(getSuburbsFromServer(value))
                .payload
                .then((response) => {
                    if (response.status == 200) {
                        console.log(response);
                        dispatch(updateSuggestions(response.data, value));
                    }
                });
        }
    }
}

function mapStateToProps(state) {
    return {
        property: state.property
    };
}

export default reduxForm({
    form: 'AddPropertyForm',
    fields: ['price', 'bond', 'availableStart', 'minTerm', 'address', 'title', 'details', 'propertyType', 'roomType', 'propertyFeature', 'files', 'contactName', 'contactNumber', 'contactEmail', 'contactSocial'],
    validate,
}, mapStateToProps, mapDispatchToProps)(AddProperty);