import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { isBusy } from '@shoutem/redux-io';
import { LoaderContainer, Dropdown } from '@shoutem/react-web-ui';
import { FormGroup, ControlLabel, MenuItem } from 'react-bootstrap';
import {
  getDropdownOptions,
  getSelectedOptionLabel,
  ALL_CATEGORIES_OPTION,
  isAllCategoriesSelected,
} from '../../services';
import CheckboxMenuItem from '../checkbox-menu-item';
import './style.scss';

const NO_FILTERED_DATA_LABEL = 'Show all categories';

function getDisplayLabel(options, selectedOptions = []) {
  if (isAllCategoriesSelected(selectedOptions)) {
    return NO_FILTERED_DATA_LABEL;
  }

  return getSelectedOptionLabel(
    options,
    selectedOptions,
    NO_FILTERED_DATA_LABEL
  );
}

export default class ChildCategorySelector extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleToggleCategory = this.handleToggleCategory.bind(this);
    this.renderCategoryMenuItem = this.renderCategoryMenuItem.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      categories: nextCategories,
      visibleCategoryIds: nextVisibleCategoryIds,
    } = nextProps;

    const {
      categories,
      visibleCategoryIds,
    } = props;

    if (nextCategories !== categories) {
      this.setState({ options: getDropdownOptions(nextCategories) });
    }
  }

  handleToggleCategory(categoryId, selected) {
    const { visibleCategoryIds } = this.props;

    const newVisibleCategoryIds = selected ?
      [...visibleCategoryIds, categoryId].sort() :
      _.filter(visibleCategoryIds, category => category !== categoryId);

    this.props.onVisibleCategoriesChange(newVisibleCategoryIds);
  }

  renderCategoryMenuItem(categoryOption) {
    const { visibleCategoryIds } = this.props;

    const { key, label } = categoryOption;
    const isChecked = _.includes(visibleCategoryIds, key);

    const disabled = (
      key !== ALL_CATEGORIES_OPTION.key &&
      isAllCategoriesSelected(visibleCategoryIds)
    );

    return (
      <CheckboxMenuItem
        checked={isChecked}
        disabled={disabled}
        id={key}
        key={key}
        label={label}
        onToggle={this.handleToggleCategory}
      />
    );
  }

  render() {
    const { options } = this.state;
    const {
      visibleCategoryIds,
      categories,
      disabled,
    } = this.props;

    const selectedOptionLabel = getDisplayLabel(options, visibleCategoryIds);
    const categoriesLoading = isBusy(categories);

    return (
      <LoaderContainer
        className="child-category-selector"
        isLoading={categoriesLoading}
        isOverlay
      >
        <FormGroup className="child-category-selector">
          <ControlLabel>
            Choose categories to display
          </ControlLabel>
          <Dropdown
            className="child-category-selector__dropdown block"
            disabled={disabled}
            id="child-category-selector__dropdown"
          >
            <Dropdown.Toggle>
              {selectedOptionLabel}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem>
                {selectedOptionLabel}
              </MenuItem>
              <MenuItem divider />
              {this.renderCategoryMenuItem(ALL_CATEGORIES_OPTION)}
              <MenuItem divider />
              <div className="child-category-selector__items">
                {_.map(options, this.renderCategoryMenuItem)}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </FormGroup>
      </LoaderContainer>
    );
  }
}

ChildCategorySelector.propTypes = {
  categories: PropTypes.array,
  disabled: PropTypes.bool,
  onVisibleCategoriesChange: PropTypes.func,
  visibleCategoryIds: PropTypes.array,
};

ChildCategorySelector.defaultProps = {
  categories: [],
  visibleCategoryIds: [],
};
