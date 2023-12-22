// templateController.js
import dotenv from 'dotenv';

dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY } = process.env;

export const renderHome = (req, res) => {
  res.render('template', {
    clientId: PAYPAL_CLIENT_ID,
    envCurrency: PAYPAL_CURRENCY,
    body: 'cart',
  });
};

export const renderRegistration = (req, res) => {
  res.render('template', {
    clientId: PAYPAL_CLIENT_ID,
    envCurrency: PAYPAL_CURRENCY,
    body: 'registration',
  });
};