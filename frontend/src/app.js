import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/image', (req, res, next) => {
    fs.readdir('../frontend/public/images/test_asset/', (err, files) => {
        if (err) throw err;

        let resultList = [];

        while (resultList.length < +req.query.count) {
            resultList.push({
                id: resultList.length,
                imageUrl: files.at(Math.random() * (files.length - 1) + 1),
            });
        }

        res.json(resultList);
    });
});

app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

export default app;
