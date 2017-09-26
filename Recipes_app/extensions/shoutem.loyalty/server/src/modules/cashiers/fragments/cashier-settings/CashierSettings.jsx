import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { InlineModal } from '@shoutem/react-web-ui';
import { shouldLoad } from '@shoutem/redux-io';
import _ from 'lodash';
import { getExtensionState } from '@shoutem/redux-api-sdk';
import { getErrorCode } from '../../../../services';
import CashiersTable from '../../components/cashiers-table';
import CashierForm from '../../components/cashier-form';
import {
  loadCashiers,
  createCashier,
  updateCashier,
  deleteCashier,
  getCashiersWithPlace,
} from '../../redux';
import { getErrorMessage } from '../../services';

export class CashierSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.handleAddCashierClick = this.handleAddCashierClick.bind(this);
    this.handleEditCashierClick = this.handleEditCashierClick.bind(this);
    this.handleHideCashierModal = this.handleHideCashierModal.bind(this);
    this.handleCashierCreated = this.handleCashierCreated.bind(this);
    this.handleCashierUpdated = this.handleCashierUpdated.bind(this);
    this.handleCashierDeleted = this.handleCashierDeleted.bind(this);
    this.renderCashierModal = this.renderCashierModal.bind(this);
  }

  componentWillMount() {
    this.setInitialState();
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { currentPlaceId } = props;
    const {
      programId: nextProgramId,
      currentPlaceId: nextCurrentPlaceId,
    } = nextProps;

    const placeIdChanged = currentPlaceId !== nextCurrentPlaceId;

    if (placeIdChanged) {
      this.setState({ currentPlaceId: nextCurrentPlaceId });
    }

    if (placeIdChanged || shouldLoad(nextProps, props, 'cashiers')) {
      this.props.loadCashiers(nextProgramId, nextCurrentPlaceId);
    }
  }

  setInitialState() {
    this.setState({
      showAddCashierModal: false,
      currentCashier: null,
    });
  }

  handleAddCashierClick() {
    this.setState({
      showAddCashierModal: true,
    });
  }

  handleEditCashierClick(cashier) {
    this.setState({
      showAddCashierModal: true,
      currentCashier: cashier,
    });
  }

  handleHideCashierModal() {
    this.setInitialState();
  }

  handleCashierCreated(cashier) {
    const { appId, programId } = this.props;

    return new Promise((resolve, reject) => {
      this.props.createCashier(cashier, programId, appId)
        .then(this.setInitialState, (action) => {
          const errorCode = getErrorCode(action);
          reject(getErrorMessage(errorCode));
        });
    });
  }

  handleCashierUpdated(cashierPatch) {
    const { programId } = this.props;
    const { currentCashier } = this.state;
    const { id } = currentCashier;

    return new Promise((resolve, reject) => {
      this.props.updateCashier(id, cashierPatch, programId)
        .then(this.setInitialState, (action) => {
          const errorCode = getErrorCode(action);
          reject(getErrorMessage(errorCode));
        });
    });
  }

  handleCashierDeleted(cashierId) {
    const { programId } = this.props;
    this.props.deleteCashier(cashierId, programId);
  }

  renderCashierModal() {
    const { places, placesDescriptor, currentPlaceId } = this.props;
    const { currentCashier } = this.state;

    const inEditMode = !!currentCashier;
    const modalTitle = inEditMode ? 'Edit cashier' : 'Add a cashier';
    const handleSubmit = inEditMode ? this.handleCashierUpdated : this.handleCashierCreated;
    const placeId = _.get(currentCashier, 'location', currentPlaceId);

    return (
      <InlineModal
        className="add-cashier-modal"
        onHide={this.handleHideCashierModal}
        title={modalTitle}
      >
        <CashierForm
          initialPlaceId={placeId}
          initialValues={currentCashier}
          onCancel={this.handleHideCashierModal}
          onSubmit={handleSubmit}
          places={places}
          placesDescriptor={placesDescriptor}
        />
      </InlineModal>
    );
  }

  render() {
    const { cashiers, places } = this.props;
    const { showAddCashierModal } = this.state;

    return (
      <div className="cashier-settings">
        <CashiersTable
          cashiers={cashiers}
          hasPlaces={!_.isEmpty(places)}
          onAddClick={this.handleAddCashierClick}
          onDeleteClick={this.handleCashierDeleted}
          onEditClick={this.handleEditCashierClick}
        />
        {showAddCashierModal && this.renderCashierModal()}
      </div>
    );
  }
}

CashierSettings.propTypes = {
  appId: PropTypes.string,
  programId: PropTypes.string,
  cashiers: PropTypes.array,
  loadCashiers: PropTypes.func,
  createCashier: PropTypes.func,
  updateCashier: PropTypes.func,
  deleteCashier: PropTypes.func,
  currentPlaceId: PropTypes.string,
  places: PropTypes.array,
  placesDescriptor: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extensionState = getExtensionState(state, extensionName);

  return {
    cashiers: getCashiersWithPlace(extensionState)(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadCashiers: (programId, placeId) => (
      dispatch(loadCashiers(programId, placeId, scope))
    ),
    createCashier: (cashier, programId, appId) => (
      dispatch(createCashier(cashier, programId, appId, scope))
    ),
    updateCashier: (cashierId, cashierPatch, programId) => (
      dispatch(updateCashier(cashierId, cashierPatch, programId, scope))
    ),
    deleteCashier: (cashierId, programId) => (
      dispatch(deleteCashier(cashierId, programId, scope))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CashierSettings);
