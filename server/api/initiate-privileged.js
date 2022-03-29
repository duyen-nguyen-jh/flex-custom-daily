const get = require('lodash/get');
const { transactionLineItems, TRANSITION_COMPLETE } = require('../api-util/lineItems');
const {
  getSdk,
  getIntegrationSdk,
  getTrustedSdk,
  handleError,
  serialize,
} = require('../api-util/sdk');

module.exports = async (req, res) => {
  const { isSpeculative, bookingData, bodyParams, queryParams } = req.body;

  const listingId = bodyParams && bodyParams.params ? bodyParams.params.listingId : null;

  const sdk = getSdk(req, res);
  const intergrationSdk = getIntegrationSdk(req, res);

  const currentUserRes = await sdk.currentUser.show();
  const currentUserId = get(currentUserRes, 'data.data.id.uuid', null);
  const currentUserBooking = await intergrationSdk.transactions.query({
    customerId: currentUserId
  });
  const isFirstBooking = !currentUserBooking.data.data.some(
    trans => trans.attributes.lastTransition === TRANSITION_COMPLETE
  );

  let lineItems = null;

  sdk.listings
    .show({ id: listingId })
    .then(listingResponse => {
      const listing = listingResponse.data.data;
      lineItems = transactionLineItems(listing, bookingData, isFirstBooking);

      return getTrustedSdk(req);
    })
    .then(trustedSdk => {
      const { params } = bodyParams;

      // Add lineItems to the body params
      const body = {
        ...bodyParams,
        params: {
          ...params,
          lineItems,
        },
      };

      if (isSpeculative) {
        return trustedSdk.transactions.initiateSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.initiate(body, queryParams);
    })
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
