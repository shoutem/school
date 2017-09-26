import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { shouldLoad, shouldRefresh } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { loadCategories, updateShortcutCategories } from '../../actions';
import {
  ParentCategorySelector,
  ChildCategorySelector,
} from '../../components';
import { getCategories } from '../../selectors';
import { ALL_CATEGORIES_OPTION } from '../../services';
import './style.scss';

function getVisibleCategoryIds(visibleCategoryIds) {
  // keyword 'all' in 'visibleCategoryIds' is used only on settings page UI,
  // to properly display checkbox named 'All categories'.
  // When saving it to settings or using it as category filter on API, we just need to
  // send empty array.
  const allCategoriesSelected = _.includes(visibleCategoryIds, ALL_CATEGORIES_OPTION.key);
  return allCategoriesSelected ? [] : visibleCategoryIds;
}

export class AdvancedSetup extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleParentCategoryChange = this.handleParentCategoryChange.bind(this);
    this.handleVisibleCategoriesChange = this.handleVisibleCategoriesChange.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);

    const { parentCategoryId, visibleCategoryIds } = props;

    this.state = {
      parentCategoryId,
      visibleCategoryIds,
      createCategoryInProgress: false,
      saveInProgress: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { parentCategoryId } = props;
    const {
      parentCategoryId: nextParentCategoryId,
      childCategories: nextChildCategories,
    } = nextProps;

    if (parentCategoryId !== nextParentCategoryId) {
      this.setState({ parentCategoryId: nextParentCategoryId });
    }

    if (shouldLoad(nextProps, props, 'rootCategories')) {
      this.props.loadRootCategories();
    }

    if (nextParentCategoryId && shouldRefresh(nextChildCategories)) {
      this.props.loadChildCategories(nextParentCategoryId);
    }
  }

  handleSave() {
    const { parentCategoryId, visibleCategoryIds } = this.state;
    this.setState({ saveInProgress: true });

    const resolvedVisibleCategoryIds = getVisibleCategoryIds(visibleCategoryIds);
    this.props.updateAdvancedOptions(parentCategoryId, resolvedVisibleCategoryIds)
      .then(() => this.setState({ saveInProgress: false }));
  }

  handleCancel() {
    const { parentCategoryId, visibleCategoryIds } = this.props;

    this.setState({
      parentCategoryId,
      visibleCategoryIds,
    });

    this.props.loadChildCategories(parentCategoryId);
  }

  handleParentCategoryChange(parentCategoryId) {
    this.setState({
      parentCategoryId,
      visibleCategoryIds: [],
    });

    this.props.loadChildCategories(parentCategoryId);
  }

  handleVisibleCategoriesChange(visibleCategoryIds = []) {
    this.setState({ visibleCategoryIds });
  }

  handleCreateCategory() {
    this.setState({ createCategoryInProgress: true });

    this.props.onCreateCategory()
      .then(() => this.setState({ createCategoryInProgress: false }));
  }

  render() {
    const {
      rootCategories,
      childCategories,
      parentCategoryId,
      visibleCategoryIds,
      schema,
    } = this.props;

    const {
      parentCategoryId: currentParentCategoryId,
      visibleCategoryIds: currentVisibleCategoryIds,
      createCategoryInProgress,
      saveInProgress,
    } = this.state;

    const actionButtonsDisabled = (
      parentCategoryId === currentParentCategoryId &&
      _.isEqual(visibleCategoryIds, currentVisibleCategoryIds)
    );

    return (
      <LoaderContainer
        className="advanced-setup"
        isLoading={createCategoryInProgress}
        isOverlay
      >
        <h3>Advanced content setup</h3>
        <form>
          <Row>
            <Col md={6}>
              <ParentCategorySelector
                categories={rootCategories}
                onCategorySelected={this.handleParentCategoryChange}
                onCreateCategorySelected={this.handleCreateCategory}
                parentCategoryId={currentParentCategoryId}
                schemaTitle={schema.title}
              />
            </Col>
            <Col md={6}>
              <ChildCategorySelector
                categories={childCategories}
                disabled={!currentParentCategoryId}
                onVisibleCategoriesChange={this.handleVisibleCategoriesChange}
                visibleCategoryIds={currentVisibleCategoryIds}
              />
            </Col>
          </Row>
          <ButtonGroup className="advanced-setup__btns">
            <Button
              bsStyle="primary"
              disabled={actionButtonsDisabled}
              onClick={this.handleSave}
            >
              <LoaderContainer isLoading={saveInProgress}>
                Save
              </LoaderContainer>
            </Button>
            <Button
              disabled={actionButtonsDisabled}
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </LoaderContainer>
    );
  }
}

AdvancedSetup.propTypes = {
  schema: PropTypes.object,
  shortcut: PropTypes.object,
  rootCategories: PropTypes.array,
  childCategories: PropTypes.array,
  parentCategoryId: PropTypes.string,
  visibleCategoryIds: PropTypes.array,
  loadRootCategories: PropTypes.func,
  loadChildCategories: PropTypes.func,
  onCreateCategory: PropTypes.func,
  updateAdvancedOptions: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    rootCategories: getCategories(state, 'parent'),
    childCategories: getCategories(state, 'child'),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { schema: fullSchema, shortcut } = ownProps;
  const { canonicalName: schema } = fullSchema;

  return {
    loadRootCategories: () => (
      dispatch(loadCategories('null', schema, 'parent'))
    ),
    loadChildCategories: (parentCategoryId) => (
      dispatch(loadCategories(parentCategoryId, schema, 'child'))
    ),
    updateAdvancedOptions: (parentCategoryId, visibleCategoryIds) => (
      dispatch(updateShortcutCategories(shortcut, parentCategoryId, visibleCategoryIds, schema))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSetup);
