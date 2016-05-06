import request from 'superagent';
import axios from 'axios'

import { ADD_PROPERTY, ADD_PROPERTY_SUCCESS, ADD_PROPERTY_FAILURE, GET_SUBURB_SUGGESTIONS, UPDATE_SUBURB_SUGGESTION_INPUT_VALUE, UPDATE_SUBURB_SUGGESTIONS, CLEAR_SUBURB_SUGGESTIONS }
    from '../constants/ActionTypes'

export function getSuburbsFromServer(suburb) {
    const req = request.get('/api/suburb')
        .query({suburb})

    return {
        type: GET_SUBURB_SUGGESTIONS,
        payload: req,
        value: suburb
    };
}

export function getSuburbSuggestions(value) {
    return dispatch => {
        dispatch(updateSuggestions(getSuburbsFromServer(value), value));
    };
}

export function updateSuggestions(suggestions, value) {
    return {
        type: UPDATE_SUBURB_SUGGESTIONS,
        suggestions,
        value
    };
}

export function updateSuburbSuggestionValue(value) {
    return {
        type: UPDATE_SUBURB_SUGGESTION_INPUT_VALUE,
        value
    };
}

export function clearSuburbSuggestions() {
    return {
        type: CLEAR_SUBURB_SUGGESTIONS
    };
}
//Create new property

export function addProperty(property) {
    var req = request.post('/api/properties')
        .set('Accept', 'application/json')

    // attach all input fields
    Object.keys(property).forEach((key, index) =>
        req.field(key, property[key])
    )

    console.log(req);
    // attach all selected files
    if (property.files) {
        property.files.map((file) =>
            req.attach(file.name, file)
        )
    }

    return {
        type: ADD_PROPERTY,
        payload: req
    };
}
