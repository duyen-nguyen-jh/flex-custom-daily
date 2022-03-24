import classNames from 'classnames';
import React from 'react';
import { PrimaryButton } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import css from './TransactionPanel.module.css';

// Functional component as a helper to build ActionButtons for
// customer when state is preauthorized
const DeclineButton = props => {
  const {
    className,
    rootClassName,
    showButtons,
    declineInProgress,
    declineSaleError,
    onDeclineBooking,
  } = props;
  const buttonsDisabled = declineInProgress;

  const declineErrorMessage = declineSaleError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.declineSaleFailed" />
    </p>
  ) : null;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionErrors}>{declineErrorMessage}</div>
      <div className={css.actionButtonWrapper}>
        <PrimaryButton
          inProgress={declineInProgress}
          disabled={buttonsDisabled}
          onClick={onDeclineBooking}
        >
          <FormattedMessage id="TransactionPanel.declineButton" />
        </PrimaryButton>
      </div>
    </div>
  ) : null;
};

export default DeclineButton;
