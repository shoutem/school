import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { IconLabel, EditableTable } from '@shoutem/react-web-ui';
import './style.scss';

function getHeaders(hasPlaces) {
  if (!hasPlaces) {
    return ['First Name', 'Last Name', 'PIN', ''];
  }

  return ['First Name', 'Last Name', 'Store', 'PIN', ''];
}

function getRowDescriptors(hasPlaces) {
  const firstNameDescriptor = {
    property: 'firstName',
    isRequired: true,
  };

  const lastNameDescriptor = {
    property: 'lastName',
    isRequired: true,
  };

  const pinDescriptor = {
    property: 'pin',
    isRequired: true,
  };

  const storeDescriptor = {
    property: 'placeName',
    isRequired: true,
  };

  if (!hasPlaces) {
    return [
      firstNameDescriptor,
      lastNameDescriptor,
      pinDescriptor,
    ];
  }

  return [
    firstNameDescriptor,
    lastNameDescriptor,
    storeDescriptor,
    pinDescriptor,
  ];
}

export default function CashiersTable({
  cashiers,
  onAddClick,
  onDeleteClick,
  onEditClick,
  hasPlaces,
}) {
  return (
    <div className="cashiers-table">
      <div className="cashiers-table__title">
        <h3>Cashier settings</h3>
        <Button
          className="btn-icon pull-right"
          onClick={onAddClick}
        >
          <IconLabel iconName="add">
            Add cashier
          </IconLabel>
        </Button>
      </div>
      <EditableTable
        className="cashiers-table"
        emptyStateText="No cashiers yet"
        headers={getHeaders(hasPlaces)}
        isStatic
        onRowDeleted={onDeleteClick}
        onRowUpdateClick={onEditClick}
        rowDescriptors={getRowDescriptors(hasPlaces)}
        rows={cashiers}
      />
    </div>
  );
}

CashiersTable.propTypes = {
  cashiers: PropTypes.array,
  onAddClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
  hasPlaces: PropTypes.bool,
};

