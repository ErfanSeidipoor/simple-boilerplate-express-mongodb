const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

exports.doHash = password =>  bcrypt.hashSync(password, saltRounds)
exports.doCompair = (password,hashedPassword) => bcrypt.compareSync(password, hashedPassword);