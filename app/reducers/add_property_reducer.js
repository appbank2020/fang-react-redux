import { ADD_PROPERTY_SUCCESS, ADD_PROPERTY_FAILURE, GET_SUBURB_SUGGESTIONS, UPDATE_SUBURB_SUGGESTION_INPUT_VALUE, UPDATE_SUBURB_SUGGESTIONS, CLEAR_SUBURB_SUGGESTIONS }
    from '../constants/ActionTypes'

const initialState = { price: '',
                        bond: '',
                        availableStart: '',
                        minTerm: '',
                        suburb: '',
                        postcode: '',
                        address: '',
                        title: '',
                        details: '',
                        propertyType: '',
                        roomType: '',
                        propertyFeature: [],
                        files: [],
                        contactName: '',
                        contactNumber: '',
                        contactEmail: '',
                        contactSocial: '',
                        suggestions: {suburbs: [], value: ''},
                        error: null };

export default function (state = initialState, action = {}) {
    let error;
    switch (action.type) {
        case ADD_PROPERTY_SUCCESS:
            return state;
        case ADD_PROPERTY_FAILURE:
            return state;
        case GET_SUBURB_SUGGESTIONS:
            return {...state, suggestions: {suburbs: [], value: ''}};
        case UPDATE_SUBURB_SUGGESTIONS:
            return {...state, suggestions: {suburbs: action.suggestions, value: action.value}};
        case UPDATE_SUBURB_SUGGESTION_INPUT_VALUE:
            return {...state, suggestions: {value: action.value}};
        case CLEAR_SUBURB_SUGGESTIONS:
            return {...state, suggestions: {suburbs: [], value: ''}};
        default:
            return state;
    }
}