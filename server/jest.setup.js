// Keep MongoMemoryServer's downloaded binaries inside the ignored server cache.
const path = require('path');
process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '.mongodb-binaries');
