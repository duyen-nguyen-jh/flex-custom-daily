import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';
import { LISTING_TYPE_EQUIPMENT } from '../../util/types';

const SectionFeaturesMaybe = props => {
  const { options, publicData, listingType } = props;
  if (!publicData) {
    return null;
  }

  const getSelectedOptionsByListingType = () => {
    if (listingType === LISTING_TYPE_EQUIPMENT)
      return publicData?.equipmentType ? publicData.equipmentType : [];
    else return publicData?.amenities ? publicData.amenities : [];
  };

  const selectedOptions = getSelectedOptionsByListingType();
  const getTitleByListingType = () => {
    if (listingType === LISTING_TYPE_EQUIPMENT)
      return "EquipmentListingPage.options";
    else return "ListingPage.amenities";
  };

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.featuresTitle" />
      </h2>
      <PropertyGroup
        id={getTitleByListingType()}
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionFeaturesMaybe;
