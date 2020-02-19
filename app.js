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





    
    app.get('/cipher', (req, res) => {
        const {text, shift} = req.query;

        if(!text) {
            return res
                .status(400)
                .send('text is required');
            }

        if (!shift) {
            return res
            .status(400)
            .send('shift is required');

        }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {

        return res
            .status(400)
            .send('shift must be a number, not a letter');
    }

    const base = 'A'.charCodeAt(0);

    
    const cipher = text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);


        if(code < base || code  > (base +26)) {
            return char;
        }

        let diff = code - base;
        diff = diff + numShift;

        diff = diff % 26;


        const shiftedChar = String.fromCharCode(base + diff);
        return shiftedChar;
    })

        .join('');

    res
    .status(200)
    .send(cipher);
    });


    
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




    app.get('/lotto', (req, res) => {
        const { numbers } = req.query;
        if (!numbers) {
            return res
                .status(400)
                .send('6 numbers required')
        }
        if (!Array.isArray(numbers)) {
            return res 
                .status(400)
                .send('numbers must be in array')
        } 
        const chosen = numbers
            .map(num => parseInt(num))
            .filter (num => !Number.isNaN(num) && (num >= 1 && num <= 20));
        
        if(chosen.length != 6) {
            return res
                .status(400)
                .send('Must be 6 numbers between 1 and 20')
        } 
        const storedNumbers = Array(20).fill(1).map((_, i) => i + 1);

        const winningNumbers = [];
        for(let i = 0; i < 6; i++){
            const ran = Math.floor(Math.random() * storedNumbers.length);
            winningNumbers.push(storedNumbers[ran]);
            storedNumbers.splice(ran, 1);
        }

        let diff = winningNumbers.filter(n => !chosen.includes(n));

        let responseText;

        switch(diff.length){
            case 0:

            responseText = 'Wow I won the powerball, woohoo!';

            break;

            case 1:
                responseText = 'Wow you won $100!'
            break;

            case 2:
                responseText = 'Congrats, FREE TICKET!';

                break;

            default:
                responseText = 'Loser!';
            
        }

            res.json({
                chosen,
                winningNumbers,
                diff,
                responseText
            });

            res.send(responseText);
        });


module.exports = app;

    // app.listen(8080, () => {
    //     console.log('listening on 8080');
    // });

