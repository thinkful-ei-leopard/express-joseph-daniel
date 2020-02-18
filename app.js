const express = require('express');
const app = express();
const morgan = require('morgan');
const array = require('./googlePlay/array');

app.use(morgan('common'));

app.get('/', (req, res) => {
    console.log('working');
    res
    .status(200)
    .send('hello');
})

app.get('/sum', (req, res) => {

    const{a, b} = req.query;
        if(!a){
            return res
                .status(400)
                .send('a is required');

        }
        if(!b){
            return res
                .status(400)
                .send('b is required');

        }

        const numA = parseFloat(a);
        const numB = parseFloat(b);
        const numC = numA + numB;

        if(Number.isNaN(numA)){
            return res
            .status(400)
            .send('a must be a number');
        }

        if(Number.isNaN(numB)){
            return res
            .status(400)
            .send('b must be a number');
        }

        {
        res
        .status(200)
        .send(`The sum of ${a} and ${b} is ${numC}`);
        }
    });

    // app.get('/cipher', (req, res) => {
    //     const {text, shift} = req.query;


    //     if (!text || !shift) {
    //         return res
    //         .status(400)
    //         .send('text and shift required');
    //     }
    // }


    // // app.get('/cipher', (req, res) => {
    // //     const {text, shift} = req.query;


    // //     if (!text) {
    // //        return res
    // //         .status(400)
    // //         .send('text and shift required');
    // //     }
    // // })

    // const numShift = parseFloat(shift);

    // if(Number.isNaN(numShift)) {
    //     return res
    //     .status(400)
    //     .send('shift must be a number, not a letter');
    // }

    // const base = 'A'.charCodeAt(0);

    
    // const cipher = text
    // .ToUpperCase()
    // .split('')
    // .map(char => {
    //     const code = char.charCodeAt(0);


    //     if(code < base || code  > (base +26)) {
    //         return char;
    //     }

    //     let diff = code - base;
    //     diff = diff + numShift;

    //     diff = diff % 26;


    //     const shiftedChar = String.fromCharCode(base + diff);
    //     return shiftedChar;
    // })

    //     .join('');

    // res
    // .status(200)
    // .send(cipher);

    app.get('/apps', (req, res) => {
        const { genre ='', sort} = req.query;
        let results = array;
        if (sort) {
            if(!['Rating', 'App'].includes(sort)) {
                 return res
                    .status(400)
                    .send('sort must be Rating or App')
            }
        }

        if (['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre.toLowerCase())) {
            results = array
            .filter(app => 
                app
                .Genres
                .toLowerCase()
                .includes(genre.toLowerCase())
                )
            }

        else if (genre) {
            return res
                .status(400)
                .send('genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcade or Card')
            }
        
        if (sort) {
            console.log(sort);
                 results
                .sort((a, b) => {
                    return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
                })
            }
            
        return res
        .json(results);
    });

    app.listen(8080, () => {
        console.log('listening on 8080');
    })