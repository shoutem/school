import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { isBusy } from '@shoutem/redux-io';
import { FormGroup, ControlLabel } from 'react-bootstrap';

const getDefaultFilerItem = (allItemsLabel) => ({
  value: 'all',
  label: allItemsLabel,
});

export default class CmsSelect extends Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.resolveStateFromProps = this.resolveStateFromProps.bind(this);

    const { allItemsLabel, defaultValue } = props;
    const defaultFilterItem = getDefaultFilerItem(allItemsLabel);

    this.state = {
      defaultFilterItem,
      filterItems: [defaultFilterItem],
      selectedValue: defaultValue || defaultFilterItem.value,
    };
  }

  componentWillMount() {
    this.resolveStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolveStateFromProps(nextProps);
  }

  resolveStateFromProps(props) {
    const { resources, descriptor, sortItems } = props;
    const { defaultFilterItem } = this.state;

    const keyProp = _.get(descriptor, 'filterKeyProp', 'id');
    const labelProp = _.get(descriptor, 'filterLabelProp', 'name');

    const filterItems = _.reduce(resources, (result, resource) => {
      const value = _.get(resource, keyProp);
      const label = _.get(resource, labelProp);

      if (!value || !label) {
        return result;
      }

      return [...result, { value, label }];
    }, [defaultFilterItem]);

    const sortedFilterItems = sortItems(filterItems);

    this.setState({ filterItems: sortedFilterItems });
  }

  handleFilterChange(selectedItem) {
    const { onFilterChange } = this.props;
    const { defaultFilterItem } = this.state;

    const { value } = selectedItem;
    this.setState({ selectedValue: value });

    const filterValue = selectedItem === defaultFilterItem ? null : value;
    onFilterChange(filterValue);
  }

  render() {
    const { dropdownLabel, resources, disabled } = this.props;
    const { selectedValue, filterItems } = this.state;

    return (
      <LoaderContainer
        className="cms-dropdown-filter"
        isLoading={isBusy(resources)}
        isOverlay
      >
        <FormGroup>
          <ControlLabel>{dropdownLabel}</ControlLabel>
          <Select
            autoBlur
            clearable={false}
            disabled={disabled}
            onChange={this.handleFilterChange}
            options={filterItems}
            value={selectedValue}
          />
        </FormGroup>
      </LoaderContainer>
    );
  }
}

CmsSelect.propTypes = {
  descriptor: PropTypes.object,
  dropdownLabel: PropTypes.string,
  resources: PropTypes.array,
  allItemsLabel: PropTypes.string,
  onFilterChange: PropTypes.func,
  defaultValue: PropTypes.string,
  sortItems: PropTypes.func,
  disabled: PropTypes.bool,
};

CmsSelect.defaultProps = {
  dropdownLabel: 'Select item',
  allItemsLabel: 'All',
  sortItems: items => _.sortBy(items, 'label'),
  disabled: false,
};
