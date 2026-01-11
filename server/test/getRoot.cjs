const axios = require('axios')
(async ()=>{
  try {
    const res = await axios.get('http://localhost:5000/')
    console.log('STATUS', res.status)
    console.log('BODY', res.data)
  } catch (err) {
    console.error('ERR', err.message)
    if (err.response) console.error('RESP', err.response.status, err.response.data)
  }
})()
