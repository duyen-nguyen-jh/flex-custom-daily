import classNames from 'classnames';
import { func, string } from 'prop-types';
import React from 'react';
import { FieldDateInput, FieldSelect } from '..';
import { bookingDateRequired } from '../../util/validators';
import css from './FieldDateTimeRangeInput.module.css';


const MAX_MOBILE_SCREEN_WIDTH = 768;
const TIME_RANGE = [
  {
    displayTime: '12:00 AM',
    value: 0,    
  },
  {
    displayTime: '01:00 AM',
    value: 1,    
  },
  {
    displayTime: '02:00 AM',
    value: 2,    
  },
  {
    displayTime: '03:00 AM',
    value: 3,    
  },
  {
    displayTime: '04:00 AM',
    value: 4,    
  },
  {
    displayTime: '05:00 AM',
    value: 5,    
  },
  {
    displayTime: '06:00 AM',
    value: 6,    
  },
  {
    displayTime: '07:00 AM',
    value: 7,    
  },
  {
    displayTime: '08:00 AM',
    value: 8,    
  },
  {
    displayTime: '09:00 AM',
    value: 9,    
  },
  {
    displayTime: '10:00 AM',
    value: 10,    
  },
  {
    displayTime: '11:00 AM',
    value: 11,    
  },
  {
    displayTime: '12:00 PM',
    value: 12,    
  },
  {
    displayTime: '01:00 PM',
    value: 13,    
  },
  {
    displayTime: '02:00 PM',
    value: 14,    
  },
  {
    displayTime: '03:00 PM',
    value: 15,    
  },
  {
    displayTime: '04:00 PM',
    value: 16,    
  },
  {
    displayTime: '05:00 PM',
    value: 17,    
  },
  {
    displayTime: '06:00 PM',
    value: 18,    
  },
  {
    displayTime: '07:00 PM',
    value: 19,    
  },
  {
    displayTime: '08:00 PM',
    value: 20,    
  },
  {
    displayTime: '09:00 PM',
    value: 21,    
  },
  {
    displayTime: '10:00 PM',
    value: 22,    
  },
  {
    displayTime: '11:00 PM',
    value: 23,    
  },
  {
    displayTime: '12:00 PM',
    value: 24,    
  },
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
              <option key={time.value} value={time.value}>
                {time.displayTime}
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
