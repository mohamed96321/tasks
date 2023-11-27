const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const books = Array.from(require('../models/Book'));
const should = chai.should();

chai.use(chaiHttp);

describe(process.env.TEST_LOCAL_HTTP, () => {});
