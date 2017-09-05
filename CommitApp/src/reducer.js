
import { combineReducers } from 'redux';

const EmptyCommitment = {
    commitment: '',
    remindAt: '6:00 PM',
    days: 0,
    doneDates: []
};

const commitment = (state = EmptyCommitment, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

const commitments = (state = {'default': EmptyCommitment}, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    commitments
});

export default rootReducer;
