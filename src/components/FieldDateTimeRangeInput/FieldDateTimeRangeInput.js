import React, { Component } from 'react';
import { bool, func, object, oneOf, string, arrayOf } from 'prop-types';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { START_DATE, END_DATE } from '../../util/dates';
import { propTypes } from '../../util/types';
import { FieldDateInput, FieldSelect } from '..';

import css from './FieldDateTimeRangeInput.module.css';
import { bookingDateRequired } from '../../util/validators';

const MAX_MOBILE_SCREEN_WIDTH = 768;
const TIME_RANGE = [
  '0:00 AM',
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 PM',
];

const FieldDateTimeRangeInput = props => {
  const {
    className,
    rootClassName,
    dateName,
    timeName,
    dateId,
    dateLabel,
    datePlaceholderText,
    timeId,
    timeLabel,
    timePlaceholderText,
    onFocusedInputChange,
    values,
    form,
    dropoffForm,
    ...rest
  } = props;
  /* eslint-disable no-unused-vars */
  if (dateLabel && !dateId) {
    throw new Error('dateId required when a dateLabel is given');
  }

  if (timeLabel && !timeId) {
    throw new Error('timeId required when a timeLabel is given');
  }

  // eslint-disable-next-line no-unused-vars
  const inputPropsDate = {
    label: dateLabel,
    id: dateId,
    placeholderText: datePlaceholderText,
    readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
  };
  const inputPropsTime = {
    label: timeLabel,
    id: timeId,
    readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
  };
  const classes = classNames(rootClassName || css.fieldRoot, className);
  const inputDate = dropoffForm ? values.dropoffDate : values.pickupDate;
  return (
    <div className={classes}>
      <div className={css.formRow}>
        <FieldDateInput
          {...inputPropsDate}
          name={dateName}
          className={css.fieldDateInput}
          validate={bookingDateRequired('Required')}
          useMobileMargins
        />
        <FieldSelect
          {...inputPropsTime}
          className={inputDate ? css.selectActive : css.selectRoot}
          name={timeName}
        >
          {!inputDate ? (
            <option value={timePlaceholderText}>{timePlaceholderText}</option>
          ) : (
            TIME_RANGE.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))
          )}
        </FieldSelect>
      </div>
    </div>
  );
};

FieldDateTimeRangeInput.defaultProps = {
  className: null,
  rootClassName: null,
  timeId: null,
  timeLabel: null,
  timePlaceholderText: null,
  dateId: null,
  dateLabel: null,
  onFocusedInputChange: null,
};

FieldDateTimeRangeInput.propTypes = {
  className: string,
  rootClassName: string,
  timeId: string,
  timeLabel: string,
  timePlaceholderText: string,
  dateId: string,
  dateLabel: string,
  onFocusedInputChange: func,
};

export default FieldDateTimeRangeInput;
