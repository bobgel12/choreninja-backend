const env = require('dotenv')
if (process.env.NODE_ENV !== 'production') {
	env.config();
}
const app = require('./app.js')

app.listen(process.env.PORT || 3000, () =>{
	console.log('Server is listenning')
})
