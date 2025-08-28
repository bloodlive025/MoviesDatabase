import z from 'zod'
//La libreria zod es para validar datos recibidos en un post
const MovieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a String',
        required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2026),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),//Uso default como valor predeterminado si no enviamos rate
    poster: z.url({
        message: 'Movie poster must be a valid URL'
    }),
    genre: z.array(z.string().transform((val) => val.toLowerCase()).pipe(
        z.enum(['action', 'comedy', 'drama', 'fantasy', 'horror', 'romance','adventure','thriller','sci-fi']),
        {
            required_error: 'Movie genre is required.',
            invalid_type_error: 'Movie genre must be one of the predefined values.'
        })
    )
})

export function validateMovie(object) {
    return MovieSchema.safeParse(object)

}

export function validatePartialMovie(object) { 
    return MovieSchema.partial().safeParse(object)
}

