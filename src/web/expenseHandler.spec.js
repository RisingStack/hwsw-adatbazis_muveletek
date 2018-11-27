const request = require('supertest');

const app = require('../web/app');

describe('expenseHandler', () => {
  it('should call', () => {
    return request(app)
      .get('/healthcheck')
      .expect(200)
      .expect({ status: 'OK' });
  });
});
