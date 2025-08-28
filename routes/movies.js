import { Router } from 'express'
import { MovieController } from '../controllers/movie.js'


export const createMoviesRouter = ({movieModel}) => {

    const moviesRouter = Router()

    const movieController = new MovieController({movieModel })

    moviesRouter.get('/', movieController.getAll)

    moviesRouter.get('/:id', movieController.getById)

    moviesRouter.post('/', movieController.create)

    moviesRouter.delete('/:id', movieController.delete)

    moviesRouter.patch('/:id', movieController.update)
    return moviesRouter
}

