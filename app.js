import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
const app = express()
import cors from 'cors'
import { corsMiddleware } from './midlewares/cors.js'

export const createApp = ({ movieModel }) => {
    app.use(corsMiddleware())


    app.use(json())

    app.disable('x-powered-by')

    app.get('/',(req,res) => {
        res.json({ message: 'Hello World' })
    })

    //Todos los recursos que sean MOVIES se identifica con /movies

    app.use('/movies', createMoviesRouter({movieModel}))

    const PORT = process.env.PORT ?? 1234

    app.listen(PORT, () => {
        console.log(`Server is listening on port http://localhost:${PORT}`)
    })

}