import cors from 'cors'


const ACCEPTED_ORIGINS = [
'http://localhost:8080',
'http://localhost:1234',
'https://movies.com'
]



export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {

        if (acceptedOrigins.includes(origin)) {
            callback(null, origin)
        }else if (!origin) {
            return callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
})