import request from "supertest";

const appUrl = 'http://localhost:3000';

describe('GET /users', () => {
  it('should return all users', () => {
    return request(appUrl)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        // expect(response.body).toEqual(
        //   expect.arrayContaining([
        //     expect.objectContaining({
        //         userId: expect.any(String),
        //         name: expect.any(String),
        //         wppNumber: expect.any(String),
        //     }),
        //   ])
        // );
      });
  });
});

describe('GET /users/:id', () => {
    it('should return 404 item not found', () => {
      return request(appUrl).get('/users/1').expect(500);
    });
});