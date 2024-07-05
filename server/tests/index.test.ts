import  request  from 'supertest'
import app from '../src/app/app'

describe('Test the root path', ():void => {
  test('it should return json object', ():void => {
    request(app)
    .get('/')
    .expect(200)
    .end((err, res) => {
        if (err) throw err;
    })        
  })
})