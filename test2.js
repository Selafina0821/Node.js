const express  = require('express')
const passport = require('passport')
const signin   = require('./test2_nodejs')

const app = express()

app.use(express.json())

app.get('/', passport.authenticate('token', { session: false }), (req, res) => {
  res.json('Success!')
})
app.post('/signin', passport.authenticate('signin', { session: false }), signin)

app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})