import React, { Component } from 'react';
import { string, bool, arrayOf, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import moment from 'moment';
import config from '../../config';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { START_DATE, END_DATE } from '../../util/dates';
import { propTypes } from '../../util/types';
import { Form, IconSpinner, PrimaryButton, FieldDateTimeRangeInput } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';

import css from './BookingDatesTimesForm.module.css';

export class BookingDatesTimesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  // In case start or end date for the booking is missing
  // focus on that input, otherwise continue with the
  // default handleSubmit function.
  handleFormSubmit(e) {
    const { pickupDate, pickupTime, dropoffDate, dropoffTime } = e ? e : {};
    const pickupDateWithTime = moment(pickupDate?.date)
      .set({ hour: pickupTime, minute: 0 })
      .toDate();
    const dropoffDateWithTime = moment(dropoffDate?.date)
      .set({ hour: dropoffTime, minute: 0 })
      .toDate();
    const submittedBooking = {
      bookingDates: {
        startDate: pickupDateWithTime,
        endDate: dropoffDateWithTime,
      },
    };

    if (!pickupDate) {
      e.preventDefault();
    } else if (!dropoffDate) {
      e.preventDefault();
    } else {
      this.props.onSubmit(submittedBooking);
    }
  }

  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  handleOnChange(formValues) {
    const { pickupDate, pickupTime, dropoffDate, dropoffTime } = formValues.values
      ? formValues.values
      : {};
    const pickupDateWithTime = moment(pickupDate?.date)
      .set({ hour: pickupTime, minute: 0 })
      .toDate();
    const dropoffDateWithTime = moment(dropoffDate?.date)
      .set({ hour: dropoffTime, minute: 0 })
      .toDate();
    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    if (pickupDate && dropoffDate && !this.props.fetchLineItemsInProgress) {
      this.props.onFetchTransactionLineItems({
        bookingData: {
          startDate: pickupDateWithTime,
          endDate: dropoffDateWithTime,
        },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesTimesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesTimesForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            formId,
            handleSubmit,
            intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitType,
            values,
            form,
            fetchTimeSlotsError,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
          } = fieldRenderProps;
          const { pickupDate, pickupTime, dropoffDate, dropoffTime } = values ? values : {};
          const pickupDateWithTime = moment(pickupDate?.date)
            .set({ hour: pickupTime, minute: 0 })
            .toDate();
          const dropoffDateWithTime = moment(dropoffDate?.date)
            .set({ hour: dropoffTime, minute: 0 })
            .toDate();

          const pickupDateTitle = intl.formatMessage({
            id: 'BookingDatesTimesForm.pickupDateTitle',
          });
          const pickupTimeTitle = intl.formatMessage({
            id: 'BookingDatesTimesForm.pickupTimeTitle',
          });
          const dropoffDateTitle = intl.formatMessage({
            id: 'BookingDatesTimesForm.dropoffDateTitle',
          });
          const dropoffTimeTitle = intl.formatMessage({
            id: 'BookingDatesTimesForm.dropoffTimeTitle',
          });
          const timeSlotsError = fetchTimeSlotsError ? (
            <p className={css.sideBarError}>
              <FormattedMessage id="BookingDatesTimesForm.timeSlotsError" />
            </p>
          ) : null;

          // This is the place to collect breakdown estimation data.
          // Note: lineItems are calculated and fetched from FTW backend
          // so we need to pass only booking data that is needed otherwise
          // If you have added new fields to the form that will affect to pricing,
          // you need to add the values to handleOnChange function
          const bookingData =
            pickupDate && dropoffDate
              ? {
                  unitType,
                  startDate: pickupDateWithTime,
                  endDate: dropoffDateWithTime,
                }
              : null;

          const showEstimatedBreakdown =
            bookingData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

          const bookingInfoMaybe = showEstimatedBreakdown ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesTimesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={lineItems} />
            </div>
          ) : null;

          const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
            <IconSpinner className={css.spinner} />
          ) : null;

          const bookingInfoErrorMaybe = fetchLineItemsError ? (
            <span className={css.sideBarError}>
              <FormattedMessage id="BookingDatesTimesForm.fetchLineItemsError" />
            </span>
          ) : null;

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };

          const now = moment();
          const today = now.startOf('day').toDate();
          const tomorrow = now
            .startOf('day')
            .add(1, 'days')
            .toDate();
          const pickupDatePlaceholderText =
            startDatePlaceholder || intl.formatDate(today, dateFormatOptions);
          const dropoffDatePlaceholderText =
            endDatePlaceholder || intl.formatDate(tomorrow, dateFormatOptions);
          const timePlaceHolderText = intl.formatTime(Date.now());

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );
          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              {timeSlotsError}
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />
              <FieldDateTimeRangeInput
                className={css.bookingDates}
                dateName="pickupDate"
                timeName="pickupTime"
                dateId={`${formId}.pickupDate`}
                dateLabel={pickupDateTitle}
                datePlaceholderText={pickupDatePlaceholderText}
                timeId={`${formId}.pickupTime`}
                timeLabel={pickupTimeTitle}
                timePlaceholderText={timePlaceHolderText}
                values={values}
                form={form}
                dropoffForm={false}
              />
              <FieldDateTimeRangeInput
                className={css.bookingDates}
                dateName="dropoffDate"
                timeName="dropoffTime"
                dateId={`${formId}.dropoffDate`}
                dateLabel={dropoffDateTitle}
                datePlaceholderText={dropoffDatePlaceholderText}
                timeId={`${formId}.dropoffTime`}
                timeLabel={dropoffTimeTitle}
                timePlaceholderText={timePlaceHolderText}
                values={values}
                form={form}
                dropoffForm={true}
              />

              {bookingInfoMaybe}
              {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe}

              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesTimesForm.ownListing'
                      : 'BookingDatesTimesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingDatesTimesForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingDatesTimesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingDatesTimesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingDatesTimesForm = compose(injectIntl)(BookingDatesTimesFormComponent);
BookingDatesTimesForm.displayName = 'BookingDatesTimesForm';

export default BookingDatesTimesForm;
