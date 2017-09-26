import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { invalidate, shouldLoad, shouldRefresh, isValid } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getShortcut } from 'environment';
import { getCategories, getSchema, getResources, dataInitialized } from '../../selectors';
import { updateShortcutSettings } from '../../builder-sdk';
import {
  loadCategories,
  createCategory,
  navigateToCategoryContent,
  loadResources,
  loadSchema,
} from '../../actions';
import {
  ManageContentButton,
  ContentPreview,
  SortOptions,
} from '../../components';
import AdvancedSetup from '../../fragments/advanced-setup';
import { CURRENT_SCHEMA } from '../../types';
import {
  getSortOptions,
  getParentCategoryId,
  getVisibleCategoryIds,
} from '../../services';
import './style.scss';

export class CmsPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleOpenInCmsClick = this.handleOpenInCmsClick.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.checkData = this.checkData.bind(this);
    this.handleSortOptionsChange = this.handleSortOptionsChange.bind(this);
    this.handleToggleAdvancedSetup = this.handleToggleAdvancedSetup.bind(this);

    const { shortcut } = props;
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const showAdvancedSetup = !_.isEmpty(visibleCategoryIds);

    this.state = {
      showAdvancedSetup,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { categories, resources, shortcut } = nextProps;

    if (shouldLoad(nextProps, props, 'schema')) {
      this.props.loadSchema();
    }

    if (shouldLoad(nextProps, props, 'categories')) {
      this.props.loadCategories();
    }

    if (isValid(categories) && shouldRefresh(resources)) {
      const parentCategoryId = getParentCategoryId(shortcut);

      if (parentCategoryId) {
        const sortOptions = getSortOptions(shortcut);
        const visibleCategoryIds = getVisibleCategoryIds(shortcut);
        this.props.loadResources(parentCategoryId, visibleCategoryIds, sortOptions);
      }
    }
  }

  handleCreateCategory() {
    const { shortcut } = this.props;

    return this.props.createCategory(shortcut)
      .then(this.props.navigateToCategory);
  }

  handleSortOptionsChange(options) {
    const { shortcut } = this.props;

    this.props.updateSortOptions(shortcut, options);
  }

  handleToggleAdvancedSetup() {
    const { showAdvancedSetup } = this.state;
    this.setState({ showAdvancedSetup: !showAdvancedSetup });
  }

  handleOpenInCmsClick() {
    const { categories, shortcut } = this.props;

    const parentCategoryId = getParentCategoryId(shortcut);
    const parentCategory = _.find(categories, { id: parentCategoryId });

    if (!parentCategory) {
      return this.handleCreateCategory();
    }

    return this.props.navigateToCategory(parentCategoryId);
  }

  render() {
    const {
      resources,
      schema,
      shortcut,
      initialized,
    } = this.props;
    const { showAdvancedSetup } = this.state;

    const hasContent = initialized && !_.isEmpty(resources);
    const cmsButtonLabel = hasContent ? 'Edit items' : 'Create items';

    const sortOptions = getSortOptions(shortcut);
    const parentCategoryId = getParentCategoryId(shortcut);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);

    return (
      <LoaderContainer className="cms" isLoading={!initialized}>
        <div className="cms__header">
          <SortOptions
            className="pull-left"
            disabled={!hasContent}
            onSortOptionsChange={this.handleSortOptionsChange}
            schema={schema}
            sortOptions={sortOptions}
          />
          <ManageContentButton
            className="pull-right"
            cmsButtonLabel={cmsButtonLabel}
            onNavigateToCmsClick={this.handleOpenInCmsClick}
            onToggleAdvancedSetup={this.handleToggleAdvancedSetup}
            showAdvancedSetup={showAdvancedSetup}
          />
        </div>
        {showAdvancedSetup &&
          <AdvancedSetup
            onCreateCategory={this.handleCreateCategory}
            parentCategoryId={parentCategoryId}
            schema={schema}
            shortcut={shortcut}
            visibleCategoryIds={visibleCategoryIds}
          />
        }
        <ContentPreview
          hasContent={hasContent}
          resources={resources}
          titleProp={schema.titleProperty}
        />
      </LoaderContainer>
    );
  }
}

CmsPage.contextTypes = {
  extensionContext: PropTypes.object,
  params: PropTypes.object,
};

CmsPage.propTypes = {
  shortcut: PropTypes.object,
  resources: PropTypes.array,
  categories: PropTypes.array,
  schema: PropTypes.shape({
    titleProperty: PropTypes.string,
  }),
  loadCategories: PropTypes.func,
  createCategory: PropTypes.func,
  navigateToCategory: PropTypes.func,
  loadResources: PropTypes.func,
  loadSchema: PropTypes.func,
  updateSortOptions: PropTypes.func,
  initialized: PropTypes.bool,
};

function mapStateToProps(state) {
  const shortcut = getShortcut();
  const initialized = dataInitialized(shortcut)(state);

  return {
    shortcut,
    initialized,
    categories: getCategories(state),
    schema: getSchema(state),
    resources: getResources(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(loadCategories()),
    loadSchema: () => dispatch(loadSchema()),
    loadResources: (categoryId, visibleCategories, sortOptions) => (
      dispatch(loadResources(categoryId, visibleCategories, sortOptions))
    ),
    createCategory: (shortcut) => (
      dispatch(createCategory(shortcut))
    ),
    navigateToCategory: (categoryId) => (
      navigateToCategoryContent(categoryId)
    ),
    updateSortOptions: (shortcut, sortOptions) => (
      dispatch(updateShortcutSettings(shortcut, sortOptions))
        .then(() => dispatch(invalidate(CURRENT_SCHEMA)))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPage);
