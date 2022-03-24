import classNames from 'classnames';
import React from 'react';
import { PrimaryButton } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import css from './TransactionPanel.module.css';

const CancelButton = props => {
  const {
    className,
    rootClassName,
    showButtons,
    cancelInProgress,
    cancelError,
    onCancelAcceptedBooking,
  } = props;
  const buttonsDisabled = cancelInProgress;

  const cancelErrorMessage = cancelError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.cancelFailed" />
    </p>
  ) : null;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionErrors}>{cancelErrorMessage}</div>
      <div className={css.actionButtonWrapper}>
        <PrimaryButton
          inProgress={cancelInProgress}
          disabled={buttonsDisabled}
          onClick={onCancelAcceptedBooking}
          className={css.dangerBtn}
        >
          <FormattedMessage id="TransactionPanel.cancelButton" />
        </PrimaryButton>
      </div>
    </div>
  ) : null;
};

export default CancelButton;
