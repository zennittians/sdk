# Stkon JavaScript SDK


This is the Stkon Javascript SDK which provides an easier way to interact with Stkon blockchain.


# Installation

This library works on both nodejs and browser. Please use it according to your use case.

## Enviorment requirement

* Nodejs: 10.0+
* Browser: Latest Chrome and Firefox
## Bundle


# Running Tests
## Unit tests
```bash
yarn test:src
```
## e2e tests

1. Remove the `'cross-fetch': 'jest-fetch-mock'` line from `scripts/jest/jest.e2e.config.js`
1. Run Stkon node locally
1. Wait for 1-2 mins, and run this:
```bash
yarn build && yarn test:e2e
```




