import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Combobox from 'design-system-react/components/combobox';

import { searchAccountsAction, accountSelectedAction, changeInputAction } from '../../actions/accountsAction';
import { fetchAccountDetailsAction } from '../../actions/accountsDetailsAction';
import NarrativeChart from '../../containers/NarrativeChart';
import Spinner from '../../components/Spinner';

class Narrative extends Component {
    static propTypes = {
        accountDetails: PropTypes.object.isRequired,
        accounts: PropTypes.array.isRequired,
        fetchAccountDetails: PropTypes.func.isRequired,
        hasErrored: PropTypes.bool.isRequired,
        isChartLoading: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        selectAccount: PropTypes.func.isRequired,
        selectedAccount: PropTypes.array.isRequired,
        handleAccountInputChange: PropTypes.func.isRequired,
        accountInput: PropTypes.string.isRequired
    }

    componentDidMount() {
        const { fetchAccountDetails, match } = this.props;

        const { account_id: accountId } = match.params;
        if (accountId) {
            fetchAccountDetails(accountId);
        }
    }

    render() {
        const { hasErrored, isLoading, accounts, fetchAccountDetails,
            selectAccount, selectedAccount, accountDetails, isChartLoading, match,
            handleAccountInputChange, accountInput } = this.props;

        if (hasErrored) {
            return <p>Sorry! There was an error loading the Account Data</p>;
        }

        let combobox = (
            <Combobox
                id="combobox-accounts"
                labels={{
                    label: 'Account',
                    placeholder: 'Enter an Account Name...',
                    noOptionsFound: isLoading
                        ? 'Loading...'
                        : 'No matches found.'
                }}
                variant="inline-listbox"
                options={
                    accounts.map((account) => {
                        return {
                            id: account.id,
                            label: account.name
                        };
                    })
                }
                events={{
                    onSelect: (event, { selection }) => {
                        if (selection && selection[0]) {
                            selectAccount(selection);
                            fetchAccountDetails(selection[0].id);
                        }
                    },
                    onRequestRemoveSelectedOption: () => {
                        selectAccount([]);
                        handleAccountInputChange('');
                    },
                    onChange: (event, { value }) => {
                        handleAccountInputChange(value);
                    }
                }}
                selection={selectedAccount}
                value={accountInput}
            />
        );

        if (match.params.account_id) {
            // URL /#/narrative/:account_id
            //   Request is coming from a salesforce iframe
            //   No need to show the account picker
            combobox = null;
        }

        if (isChartLoading) {
            return <Spinner/>;
        }

        return (
            <div className="slds-grid">
                <div className="slds-col slds-p-around--small">
                    <div className="slds-text-heading_large slds-align_absolute-center">EWS Narrative</div>
                    { combobox }
                    <NarrativeChart
                        scores={accountDetails.scores}
                        pointEvents={accountDetails.pointEvents}
                        intervalEvents={accountDetails.intervalEvents}
                        size={{
                            width: 700,
                            height: 500
                        }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accountDetails: state.accountDetails.data || {},
        accounts: state.accounts.data || [],
        hasErrored: state.accounts.hasErrored || state.accountDetails.hasErrored || false,
        isChartLoading: state.accountDetails.isLoading || false,
        isLoading: state.accounts.isLoading || false,
        selectedAccount: state.accounts.selected || [],
        accountInput: state.accounts.accountInput
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAccountDetails: (id) => dispatch(fetchAccountDetailsAction(id)),
        selectAccount: (selection) => dispatch(accountSelectedAction(selection)),
        handleAccountInputChange: (value) => {
            dispatch(changeInputAction('accountInput', value));
            if (value) {
                dispatch(searchAccountsAction(value));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Narrative);
