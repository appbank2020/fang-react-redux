import React, { Component } from 'react';
import { getSuburbSuggestions, getSuburbsFromServer, updateSuggestions, updateSuburbSuggestionValue, clearSuburbSuggestions, addProperty } from '../actions/property'
import { reduxForm } from 'redux-form'
import { browserHistory } from 'react-router'
import AddProperty from '../components/AddProperty'
import moment from 'moment'

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
    dispatch(addProperty(values))
        .payload
        .end((err, res) => {
            if (!err) {
                browserHistory.push({
                    pathname: `/property/${res.body.id}`
                })
            }
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
                .end((err, res) => {
                    if (!err) {
                        dispatch(updateSuggestions(res.body, value));
                    }
                });
        }
    }
}

function mapStateToProps(state) {
    console.log(state);
    
    return {
        property: state.property,
        initialValues: state.property
    };
}

export default reduxForm({
    form: 'AddPropertyForm',
    fields: ['price', 'bond', 'availableStart', 'minTerm', 'suburb', 'postcode', 'address', 'title', 'details', 'propertyType', 'roomType', 'propertyFeature', 'files', 'imageCount', 'contactName', 'contactNumber', 'contactEmail', 'contactSocial', 'preferredContact'],
    validate
}, mapStateToProps, mapDispatchToProps)(AddProperty);