const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'tina', '__generated__');
const schema = JSON.parse(fs.readFileSync(path.join(base, '_schema.json'), 'utf8'));
const lookup = JSON.parse(fs.readFileSync(path.join(base, '_lookup.json'), 'utf8'));
const graphql = JSON.parse(fs.readFileSync(path.join(base, '_graphql.json'), 'utf8'));
fs.writeFileSync(path.join(__dirname, '..', 'tina', 'tina-lock.json'), JSON.stringify({ schema, lookup, graphql }));
console.log('tina-lock.json regenerated');
