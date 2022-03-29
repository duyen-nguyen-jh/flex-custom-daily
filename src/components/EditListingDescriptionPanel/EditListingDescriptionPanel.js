import classNames from 'classnames';
import { bool, func, object, string } from 'prop-types';
import React from 'react';
import { ListingLink } from '../../components';
import config from '../../config';
import { EditEquipmentListingGeneralForm, EditListingDescriptionForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT, LISTING_TYPE_EQUIPMENT } from '../../util/types';
import css from './EditListingDescriptionPanel.module.css';

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
    listingType,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;
  const { manufactureYear, maxUsingTime, equipmentType } = publicData;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const renderMessageByListingType = () =>
    listingType === LISTING_TYPE_EQUIPMENT ? (
      <FormattedMessage id="EditEquipmentListingDescriptionPanel.createListingTitle" />
    ) : (
      <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />
    );

  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    renderMessageByListingType()
  );

  const getCategoryOptions = () =>
    listingType === LISTING_TYPE_EQUIPMENT
      ? findOptionsForSelectFilter('equipmentType', config.custom.filters)
      : findOptionsForSelectFilter('category', config.custom.filters);

  const renderFormByListingType = () =>
    listingType === LISTING_TYPE_EQUIPMENT ? (
      <EditEquipmentListingGeneralForm
        className={css.form}
        initialValues={{
          title,
          description,
          equipmentType,
          manufactureYear,
          maxUsingTime,
        }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, description, equipmentType, manufactureYear, maxUsingTime } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: {
              equipmentType,
              manufactureYear,
              maxUsingTime,
              listingType: LISTING_TYPE_EQUIPMENT,
            },
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
    ) : (
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
