const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('Express App', () => {
    it('should return a message from GET /', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'hello')
    });
    it('should return an array of apps from /apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('array');
                })
    })
    it('returns 400 when not sort is not rating or app', () => {
        return supertest(app)
            .get('/apps?sort=asdf')
            .expect(400, 'sort must be Rating or App')
    })
    it('filters array by genre', () => {
        return supertest(app)
            .get('/apps?genre=action')
            .expect(200)
                .then(res => {
                    res.body.map(app => expect(app.Genres.includes('action')))
                })
    })
    it('returns 400 when genre is not one of specified genres', () => {
        return supertest(app)
            .get('/apps?genre=asdf')
            .expect(400, 'genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcade or Card')
    })
    it('sorts results based on rating', () => {
        return supertest(app)
            .get('/apps?sort=Rating')
            .expect(200)
                .then(res => {
                    for(let i=0; i<res.body.length -1; i++) {
                        expect(res.body[i].Rating <= res.body[(i + 1)].Rating)
                    }
                })
    })
    it('sorts results based on app', () => {
        return supertest(app)
            .get('/apps?sort=App')
            .expect(200)
                .then(res => {
                    for(let i=0; i<res.body.length -1; i++) {
                        expect(res.body[i].App <= (res.body[i + 1].App))
                    }
                })
    })
});

