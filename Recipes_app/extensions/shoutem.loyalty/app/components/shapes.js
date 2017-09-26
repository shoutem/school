import React from 'react';

const { date, number, shape, string } = React.PropTypes;

const authorizationShape = shape({
  // Authorization type: PIN, user ID and others in the future
  authorizationType: string,
  // Loyalty card ID for which the transaction is being authorized
  cardId: string,
  // The PIN
  pin: string,
});

const cashierShape = shape({
  user: shape({
    // User ID for cashier
    id: number,
  }),
  // Cashier PIN
  pin: number,
});

const cardStateShape = shape({
  // Points for a place or single card
  points: number,
});

const placeShape = shape({
  location: shape({
    // Address of the place
    formattedAddress: string,
    image: shape({
      // Image URL
      url: string,
    }),
    // Points for this place
    points: number,
  }),
});

const rewardShape = shape({
  image: shape({
    // Image URL
    url: string,
  }),
  // Number of points on the card if the reward is a punch card
  points: number,
  // Number of points required to redeem the reward
  pointsRequired: number,
});

const transactionShape = shape({
  transactionData: shape({
    // Number of points assigned or redeemed
    points: number,
  }),
  // Timestamp
  createdAt: date,
});

export {
  authorizationShape,
  cardStateShape,
  cashierShape,
  rewardShape,
  placeShape,
  transactionShape,
 };
