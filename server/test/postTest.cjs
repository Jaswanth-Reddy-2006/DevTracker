const axios = require('axios')

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/tasks', { name: 'cli-test-task-from-cjs' }, { headers: { 'Content-Type': 'application/json' } })
    console.log('STATUS', res.status)
    console.log('BODY', res.data)
  } catch (err) {
    if (err.response) {
      console.error('ERROR STATUS', err.response.status)
      console.error('ERROR DATA', err.response.data)
    } else {
      console.error('REQUEST ERROR', err.message)
    }
  }
})()
