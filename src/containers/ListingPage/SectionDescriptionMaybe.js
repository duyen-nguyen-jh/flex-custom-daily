import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 20;
const LISTING_TYPE = {
  equipment: 'equipment',
};

const SectionDescriptionMaybe = props => {
  const { description, listingType } = props;
  const renderTitleByListingType = () => {
    if (listingType === LISTING_TYPE.equipment) 
      return 'EquipmentListingPage.descriptionTitle';
    else return 'ListingPage.descriptionTitle';
  };

  return description ? (
    <div className={css.sectionDescription}>
      <h2 className={css.descriptionTitle}>
        <FormattedMessage id={renderTitleByListingType()} />
      </h2>
      <p className={css.description}>
        {richText(description, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
          longWordClass: css.longWord,
        })}
      </p>
    </div>
  ) : null;
};

export default SectionDescriptionMaybe;
