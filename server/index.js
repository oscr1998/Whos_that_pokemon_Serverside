const dotenv = require('dotenv');
dotenv.config();
const app = require('./server');

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Express departed from port ${port}`))
