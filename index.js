import express from 'express';
import path from 'path';
import router from './assets/js/routes/servers.js';


const app = express();
const __dirname = path.resolve();
const PORT = 3000;


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.get('/index', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'signup.html'));
});
app.get('/catalog', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'catalog.html'));
});
app.get('/item', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'item.html'));
});
app.get('/rent', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'item-rent.html'));
});


app.use(express.static(__dirname+"/"));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use(router);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`)
});