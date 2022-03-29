import React from 'react';
import { required } from '../../util/validators';
import { FieldCheckbox } from '../../components';

import css from './EditEquipmentListingGeneralForm.module.css';

const CustomCategorySelectFieldMaybe = props => {
  const { name, id, categories, intl } = props;
  const categoryLabel = intl.formatMessage({
    id: 'EditEquipmentListingDescriptionForm.categoryLabel',
  });

  const categoryRequired = required(
    intl.formatMessage({
      id: 'EditEquipmentListingDescriptionForm.categoryRequired',
    })
  );
  return categories ? (
    <>
      <label className={css.equipCatLabel}>{categoryLabel}</label>
      <div className={css.flexContainer}>
        {categories.map(c => (
          <FieldCheckbox
            key={c.key}
            className={css.category}
            id={c.key}
            name={name}
            label={c.label}
            value={c.key}
          />
        ))}
      </div>
    </>
  ) : null;
};

export default CustomCategorySelectFieldMaybe;
