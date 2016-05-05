import request from 'superagent';
import axios from 'axios'

import { ADD_PROPERTY_SUCCESS, ADD_PROPERTY_FAILURE, GET_SUBURB_SUGGESTIONS, UPDATE_SUBURB_SUGGESTION_INPUT_VALUE, UPDATE_SUBURB_SUGGESTIONS, CLEAR_SUBURB_SUGGESTIONS }
    from '../constants/ActionTypes'

export function getSuburbsFromServer(suburb) {
    const request = axios.get('/api/suburb', {
            params: {suburb}
        })

    return {
        type: GET_SUBURB_SUGGESTIONS,
        payload: request
    };
        /*request.get('/api/suburb/')
            .query({ suburb })
            .end((err, res) => {
                if (!err) {
                    return res.body;
                }
            })
            */
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
    console.log(property);
    var req = request.post('/api/properties')
        .set('Accept', 'application/json')

    // attach all input fields
    Object.keys(property).forEach((key, index) =>
        req.field(key, property[key])
    )

    // attach all selected files
    if (property.files) {
        property.files.map((file) =>
            req.attach(file.name, file)
        )
    }

    req.end((error, response) => {
        console.log(error, response);
        if (error) {
            return {
                type: ADD_PROPERTY_FAILURE,
                payload: error
            };
        } else {
            return {
                type: ADD_PROPERTY_SUCCESS,
                payload: response.body
            };
        }
    })
}
