import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditEquipmentListingGeneralForm, EditListingDescriptionForm } from '../../forms';
import config from '../../config';

import css from './EditListingDescriptionPanel.module.css';

const LIST_TYPE = {
  equipment: 'equipmentList',
};

const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    listType,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;
  const { manufactureYear, maxUsingTime, category } = publicData;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const renderMessageByListingType = () => {
    if (listType === LIST_TYPE.equipment)
      return <FormattedMessage id="EditEquipmentListingDescriptionPanel.createListingTitle" />;
    else return <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />;
  };

  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    renderMessageByListingType()
  );

  const getCategoryOptions = () => {
    if (listType === LIST_TYPE.equipment) {
      return findOptionsForSelectFilter('equipmentType', config.custom.filters);
    } else {
      return findOptionsForSelectFilter('category', config.custom.filters);
    }
  };

  const renderFormByListingType = () => {
    if (listType === LIST_TYPE.equipment) {
      return (
        <EditEquipmentListingGeneralForm
          className={css.form}
          initialValues={{
            title,
            description,
            category,
            manufactureYear,
            maxUsingTime,
          }}
          saveActionMsg={submitButtonText}
          onSubmit={values => {
            const { title, description, category, manufactureYear, maxUsingTime } = values;
            const updateValues = {
              title: title.trim(),
              description,
              publicData: { category, manufactureYear, maxUsingTime },
            };

            onSubmit(updateValues);
          }}
          onChange={onChange}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
          categories={getCategoryOptions()}
        />
      );
    } else {
      return (
        <EditListingDescriptionForm
          className={css.form}
          initialValues={{ title, description, category: publicData.category }}
          saveActionMsg={submitButtonText}
          onSubmit={values => {
            const { title, description, category } = values;
            const updateValues = {
              title: title.trim(),
              description,
              publicData: { category },
            };

            onSubmit(updateValues);
          }}
          onChange={onChange}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
          categories={getCategoryOptions()}
        />
      );
    }
  };
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {renderFormByListingType()}
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingDescriptionPanel;
