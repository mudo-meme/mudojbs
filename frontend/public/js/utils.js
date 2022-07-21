import Header from '../components/header';
import Router from '../js/router';

const myRouter = new Router();
const myHeader = new Header(myRouter);

export default { myRouter, myHeader };
