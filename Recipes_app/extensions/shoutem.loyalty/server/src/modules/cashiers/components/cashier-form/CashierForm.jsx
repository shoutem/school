import React, { PropTypes } from 'react';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import {
  PasswordBox,
  LoaderContainer,
  ReduxFormElement,
} from '@shoutem/react-web-ui';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { getFormState } from '../../../../redux';
import { CmsSelect } from '../../../cms';
import { validateCashier } from '../../services';
import './style.scss';

const PASSWORD_HELP_TEXT =
  'Used by the cashier to login to application. Can contain numbers and/or letters';
const PIN_HELP_TEXT =
  'Used by the cashier to confirm customer transaction. Can contain numbers and/or letters';

export function CashierForm({
  submitting,
  fields,
  onCancel,
  handleSubmit,
  error,
  places,
  placesDescriptor,
  currentPlaceId,
  onPlaceChange,
}) {
  const { id, firstName, lastName, email, password, pin } = fields;

  const inEditMode = !_.isEmpty(id.value);
  if (inEditMode) {
    // if cashier exists, he already has password. We cannot get it from API (security issue),
    // but we still want to indicate that password exists and that it cannot be changed here.
    password.value = '*******';
  }

  return (
    <form className="cashier-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="firstName"
          field={firstName}
          name="First name"
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="lastName"
          field={lastName}
          name="Last name"
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={inEditMode || submitting}
          elementId="email"
          field={email}
          name="E-mail address"
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={inEditMode || submitting}
          elementId="password"
          field={password}
          helpText={PASSWORD_HELP_TEXT}
          name="App login password"
        >
          <PasswordBox />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="pin"
          field={pin}
          helpText={PIN_HELP_TEXT}
          name="PIN"
        />
      </Row>
      {!_.isEmpty(places) &&
        <Row>
          <CmsSelect
            allItemsLabel="All stores"
            defaultValue={currentPlaceId}
            descriptor={placesDescriptor}
            dropdownLabel="Select a store"
            onFilterChange={onPlaceChange}
            resources={places}
          />
        </Row>
      }
      <ButtonToolbar>
        <Button bsStyle="primary" bsSize="large" disabled={submitting} type="submit">
          <LoaderContainer isLoading={submitting}>
            {inEditMode ? 'Save' : 'Add'}
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
      </ButtonToolbar>
      {error &&
        <div className="has-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      }
    </form>
  );
}

CashierForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  error: PropTypes.string,
  currentPlaceId: PropTypes.string,
  places: PropTypes.array,
  placesDescriptor: PropTypes.object,
  onPlaceChange: PropTypes.func,
};

export default reduxForm({
  getFormState,
  form: 'cashierForm',
  fields: [
    'id',
    'firstName',
    'lastName',
    'email',
    'password',
    'pin',
  ],
  validate: validateCashier,
})(CashierForm);
