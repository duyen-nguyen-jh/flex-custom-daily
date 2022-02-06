/**
 * Provides a date picker for Final Forms (using https://github.com/airbnb/react-dates)
 *
 * NOTE: If you are using this component inside BookingDatesForm,
 * you should convert value.date to start date and end date before submitting it to API
 */

import React, { Component } from 'react';
import { bool, func, object, oneOf, string, arrayOf } from 'prop-types';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { START_DATE, END_DATE } from '../../util/dates';
import { propTypes } from '../../util/types';
import { FieldDateInput, FieldSelect } from '..';

import css from './FieldDateTimeRangeInput.module.css';

const MAX_MOBILE_SCREEN_WIDTH = 768;

class FieldDateTimeRangeInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Update focusedInput in case a new value for it is
    // passed in the props. This may occur if the focus
    // is manually set to the date picker.
    if (this.props.focusedInput && this.props.focusedInput !== prevProps.focusedInput) {
      this.setState({ focusedInput: this.props.focusedInput });
    }
  }

  handleBlur(focusedInput) {
    this.setState({ focusedInput: null });
    this.props.input.onBlur(focusedInput);
    // Notify the containing component that the focused
    // input has changed.
    if (this.props.onFocusedInputChange) {
      this.props.onFocusedInputChange(null);
    }
  }

  handleFocus(focusedInput) {
    this.setState({ focusedInput });
    this.props.input.onFocus(focusedInput);
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      rootClassName,
      unitType,
      dateId,
      dateLabel,
      datePlaceholderText,
      timeId,
      timeLabel,
      timePlaceholderText,
      input,
      meta,
      useMobileMargins,
      validate,
      // Extract focusedInput and onFocusedInputChange so that
      // the same values will not be passed on to subcomponents.
      focusedInput,
      onFocusedInputChange,
      ...rest
    } = this.props;
    /* eslint-disable no-unused-vars */

    if (dateLabel && !dateId) {
      throw new Error('dateId required when a dateLabel is given');
    }

    if (timeLabel && !timeId) {
      throw new Error('timeId required when a timeLabel is given');
    }

    const { touched, error } = meta;
    const value = input.value;

    // If startDate is valid label changes color and bottom border changes color too
    const startDateIsValid = value && value.startDate instanceof Date;
    const dateLabelClasses = classNames(css.dateLabel, {
      [css.labelSuccess]: false, //startDateIsValid,
    });

    // If endDate is valid label changes color and bottom border changes color too
    const endDateIsValid = value && value.endDate instanceof Date;
    const timeLabelClasses = classNames(css.timeLabel, {
      [css.labelSuccess]: false, //endDateIsValid,
    });

    // eslint-disable-next-line no-unused-vars
    const { onBlur, onFocus, type, checked, ...restOfInput } = input;
    const inputPropsDate = {
      label: dateLabel,
      id: dateId,
      placeholderText: datePlaceholderText,
      unitType,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      useMobileMargins,
      validate,
      readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
      ...restOfInput,
      ...rest,
      focusedInput: this.state.focusedInput,
    };
    const inputPropsTime = {
      label: timeLabel,
      id: timeId,
      placeholderText: timePlaceholderText,
      unitType,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      validate,
      useMobileMargins,
      readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
      ...restOfInput,
      ...rest,
      focusedInput: this.state.focusedInput,
    };
    const classes = classNames(rootClassName || css.fieldRoot, className);

    return (
      <div className={classes}>
        <div className={css.formRow}>
          <FieldDateInput {...inputPropsDate} className={css.fieldDateInput} />
          <FieldSelect
            {...inputPropsTime}
            className={css.selectRoot}
          >
            <option>{timePlaceholderText}</option>
          </FieldSelect>
        </div>
      </div>
    );
  }
}

FieldDateTimeRangeInputComponent.defaultProps = {
  className: null,
  rootClassName: null,
  useMobileMargins: false,
  timeId: null,
  timeLabel: null,
  timePlaceholderText: null,
  dateId: null,
  dateLabel: null,
  startDatePlaceholderText: null,
  focusedInput: null,
  onFocusedInputChange: null,
  timeSlots: null,
};

FieldDateTimeRangeInputComponent.propTypes = {
  className: string,
  rootClassName: string,
  unitType: propTypes.bookingUnitType.isRequired,
  useMobileMargins: bool,
  timeId: string,
  timeLabel: string,
  timePlaceholderText: string,
  dateId: string,
  dateLabel: string,
  startDatePlaceholderText: string,
  timeSlots: arrayOf(propTypes.timeSlot),
  input: object.isRequired,
  meta: object.isRequired,
  focusedInput: oneOf([START_DATE, END_DATE]),
  onFocusedInputChange: func,
};

const FieldDateTimeRangeInput = props => {
  return <Field component={FieldDateTimeRangeInputComponent} {...props} />;
};

export default FieldDateTimeRangeInput;
