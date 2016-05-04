import React, {Component, PropTypes} from 'react'
import { addProperty } from '../actions/property'
import { getSuburbs } from '../actions/suburb'
import { reduxForm } from 'redux-form'
import { browserHistory } from 'react-router'
import Navbar from './Navbar'
import Select from 'react-select'
import AutoSuggest from 'react-autosuggest'
import DatePicker from 'react-datepicker'
import counterpart from 'counterpart'
import Dropzone from 'react-dropzone'
import moment from 'moment'

const DropzoneStyles = {
  width: '100%',
  height: '100px',
  backgroundColor: '#E6E6E6',
  border: '1px grey dotted',
}

const TextCenterDivStyles = {
  textAlign: 'center',
  verticalAlign: 'middle',
  lineHeight: '90px',
  cursor: 'pointer',
}

const ImagePreviewStyles = {
  height: '80px',
  margin: '2px',
}

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

const getSuggestions = (values) => {
    console.log(values, getSuburbs(values.value));
};

const mapDispatchToProps = (dispatch) => {
  return {
    addProperty: validateAndAddProperty,
    getSuburbSuggestions: getSuggestions
  }
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    property: state.property,
    suburbs: state.suburb
  }
}

class AddProperty extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.property.property && !nextProps.property.error) {
      this.context.router.push('/');
    }
  }

  onSuburbSearchChange(event, object) {
    console.log(object);
  }

  onSuggestionsUpdateRequested(object) {
    console.log(this.props);
  }

  onSuggestionSelected(event, object) {

  }

  getSuggestionValue(suggestion) {
    return suggestion.value;
  }

  renderError(property) {
    if(property && property.error && property.error.message) {
      return (
          <div className="alert alert-danger">
            {property ? property.error.message : ''}
          </div>
      );
    } else {
      return <span></span>
    }
  }

  renderSuggestion(suggestion) {
    return (
        <span>{suggestion.label}</span>
    )
  }

  render() {
    const {fields: { price, bond, availableStart, minTerm, suburb, address, title, details, propertyType, roomType, propertyFeature, files, contactName, contactNumber, contactEmail, contactSocial }, handleSubmit, submitting, dispatch, property, suburbs} = this.props;

    console.log(this.props);

    const suggestions = []

    const theme = {
      input: 'form-control',
      suggestionsContainer: 'search-results',
      suggestion: 'search-list-item'
    }
    const inputProps = {
      placeholder: counterpart('nav.search.placeholder'),
      value: this.props.values.suburb,
      onChange: this.onSuburbSearchChange.bind(this),
      type: 'search'
    }


    const bondOptions = [
      { value: '0', label: 'No bond required' },
      { value: '2', label: '2 weeks bond' },
      { value: '4', label: '4 weeks bond' }
    ]

    const termOptions = [
      { value: '0', label: 'No minimum term' },
      { value: '1', label: 'At least 1 month' },
      { value: '2', label: 'At least 2 months' },
      { value: '4', label: 'At least 4 months' },
      { value: '6', label: 'At least 6 months' },
      { value: '8', label: 'At least 8 months' },
      { value: '12', label: 'At least 1 year' }
    ]

    const propertyTypeOptions = [
      { value: 'apartment', label: 'Apartment/Unit' },
      { value: 'studio', label: 'Studio' },
      { value: 'house', label: 'House/Townhouse' },
      { value: 'whole', label: 'Entire flat' }
    ]

    const roomTypeOptions = [
      { value: 'private', label: 'Single Room' },
      { value: 'shared', label: 'Shared Room' },
      { value: 'living', label: 'Living Room' },
      { value: 'master', label: 'Master Room' }
    ]

    const propertyFeatureOptions = [
      { value: 'furnished', label: 'Furnished' },
      { value: 'femalePrefer', label: 'Female Prefer' },
      { value: 'nonSmoker', label: 'Non Smoker' },
      { value: 'petAllowed', label: 'Pet Allowed' },
      { value: 'billInclude', label: 'Bill Included' },
      { value: 'fastInternet', label: 'Fast Internet' }
    ]

    return (
        <div>
          <Navbar pageFlag="addProperty" />
          <div className="container">
            <h2>Add Property</h2>
            {this.renderError(property)}
            <form onSubmit={handleSubmit(this.props.addProperty.bind(this))} className="form-horizontal">
              <section className="basic">
                <div className={`form-group ${price.touched && price.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Rent per week $</label>
                  <div className="col-sm-9">
                    <input type="number" className="form-control" autofocus {...price}/>
                    <span className="help-block">{price.touched ? price.error : ''}</span>
                  </div>
                </div>
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">How many weeks bond</label>
                  <div className="col-sm-9">
                    <Select
                        simpleValue
                        value={bond.value}
                        options={bondOptions}
                        {...bond}
                        onBlur={() => bond.onBlur(bond.value)}
                    />
                  </div>
                </div>
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">Available Date</label>
                  <div className="col-sm-9">
                    <DatePicker
                        className="form-control"
                        dateFormat="YYYY-MM-DD"
                        minDate={moment()}
                        selected={availableStart.value ? moment(availableStart.value) : moment() }
                        {...availableStart}
                    />
                  </div>
                </div>
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">Minimum Terms</label>
                  <div className="col-sm-9">
                    <Select
                        simpleValue
                        value={minTerm.value}
                        options={termOptions}
                        {...minTerm}
                        onBlur={() => minTerm.onBlur(minTerm.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="address">
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">Suburb or postcode</label>
                  <div className="col-sm-9">
                    <AutoSuggest
                      theme={theme}
                      suggestions={suggestions}
                      onSuggestionsUpdateRequested={getSuggestions}
                      onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                      getSuggestionValue={this.getSuggestionValue.bind(this)}
                      renderSuggestion={this.renderSuggestion.bind(this)}
                      inputProps={inputProps}
                      {...suburb}
                      />
                  </div>
                </div>

                <div className={`form-group ${address.touched && address.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Address</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" {...address}/>
                    <span className="help-block">{address.touched ? address.error : ''}</span>
                  </div>
                </div>
              </section>

              <section className="details">
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">Title</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" {...title}/>
                  </div>
                </div>
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">Details</label>
                  <div className="col-sm-9">
                    <textarea
                        rows="4"
                        className="form-control"
                        {...details}
                    />
                  </div>
                </div>
                <div className={`form-group ${propertyType.touched && propertyType.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Property Type</label>
                  <div className="col-sm-9">
                    <Select
                        simpleValue
                        value={propertyType.value}
                        options={propertyTypeOptions}
                        {...propertyType}
                        onBlur={() => propertyType.onBlur(propertyType.value)}
                    />
                    <span className="help-block">{propertyType.touched ? propertyType.error : ''}</span>
                  </div>
                </div>
                <div className={`form-group ${roomType.touched && roomType.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Room Type</label>
                  <div className="col-sm-9">
                    <Select
                        simpleValue
                        value={roomType.value}
                        options={roomTypeOptions}
                        {...roomType}
                        onBlur={() => roomType.onBlur(roomType.value)}
                    />
                    <span className="help-block">{roomType.touched ? roomType.error : ''}</span>
                  </div>
                </div>
                <div className={`form-group`}>
                  <label className="col-sm-3 control-label">Property Feature</label>
                  <div className="col-sm-9">
                    <Select
                        multi
                        value={propertyFeature.value}
                        options={propertyFeatureOptions}
                        {...propertyFeature}
                        onBlur={() => propertyFeature.onBlur(propertyFeature.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label">Property Images</label>
                  <div className="col-sm-9">
                    <Dropzone {...files} onDrop={this.onDrop} style={DropzoneStyles}>
                      <div style={TextCenterDivStyles}>
                        Drop photos here or click to select photos to upload.
                      </div>
                    </Dropzone>
                    {
                      this.props.fields.files.value ?
                          <div>
                            <div>
                              {
                                this.props.fields.files.value.each((file, i) =>
                                    <img key={`image-preview-${i}`}
                                         src={file.preview} style={ImagePreviewStyles}
                                    />
                                )
                              }
                            </div>
                          </div> : null
                    }
                  </div>
                </div>
              </section>
              <section className="contact">
                <div className={`form-group ${contactName.touched && contactName.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Contact Name</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" {...contactName}/>
                    <span className="help-block">{contactName.touched ? contactName.error : ''}</span>
                  </div>
                </div>
                <div className={`form-group ${contactNumber.touched && contactNumber.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Contact Number</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" {...contactNumber}/>
                  </div>
                </div>
                <div className={`form-group ${contactEmail.touched && contactEmail.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Contact Email</label>
                  <div className="col-sm-9">
                    <input type="email" className="form-control" {...contactEmail}/>
                  </div>
                </div>
                <div className={`form-group ${contactSocial.touched && contactSocial.invalid ? 'has-error' : ''}`}>
                  <label className="col-sm-3 control-label">Wechat</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" {...contactSocial}/>
                    <span className="help-block">{contactSocial.touched ? contactSocial.error : ''}</span>
                  </div>
                </div>
              </section>
              <button type="submit" className="btn btn-primary pull-right"  disabled={submitting} >Submit</button>
            </form>
          </div>
        </div>
    )
  }
}

export default reduxForm({
  form: 'AddPropertyForm',
  fields: ['price', 'bond', 'availableStart', 'minTerm', 'suburb', 'address', 'title', 'details', 'propertyType', 'roomType', 'propertyFeature', 'files', 'contactName', 'contactNumber', 'contactEmail', 'contactSocial'],
  validate,
}, mapStateToProps, mapDispatchToProps)(AddProperty);