const fetch = require('node-fetch')

const getIntent = async (query, nlpData) => {
  if (!nlpData) {
    return null
  }
  const q = encodeURIComponent(query);
  const uri = nlpData.route + q;
  const auth = `Bearer ${nlpData.auth}`;
  const intent = await fetch(uri, {headers: {Authorization: auth}})
    .then(res => res.json())

  if (!intent.intents.length) {
    console.log('intent: null')
    return null
  } else {
    console.log(`intent: ${intent.intents[0].name}`)
    return intent.intents[0].name
  }
}

module.exports = {getIntent}