import mysql from 'mysql2/promise'

const config = {
    host: '192.168.56.1',
    user: 'admin03',
    port: 3306,
    password: 'admin03',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)



export class MovieModel {
    static async getAll ({genre}){
        if (genre){
            const toLowerCaseGenre = genre.toLowerCase()
            const [genres] = await connection.query(
                'SELECT id , name  FROM genre WHERE LOWER(name) = ?;', [toLowerCaseGenre])
            console.log(genres)

            if (genres.length === 0 ){
                return []
            }

            const [{ id }] = genres
            console.log(id)
            const [movies] = await connection.query(
                `SELECT BIN_TO_UUID(id) as id, title, poster, year FROM movie INNER JOIN movie_genres
                 ON movie.id = movie_genres.movie_id
                 WHERE movie_genres.genre_id = ?;`, [id]
            )

            return movies
        }
        const [result] = await connection.query('SELECT BIN_TO_UUID(id) as id, title ,poster,year FROM movie;')
        return result
    }

    static async getById ({id}) {
        const [movie] = await connection.query(
            'SELECT BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [id]
        )
        return movie
    }

    static async create ({ input }) {
        const {
        genre:genreInput, // El valor de genre del objeto input es pasado a genreInput
        title,
        year,
        director,
        duration,
        rate,
        poster
        } = input


        // todo: crear la conexión de genre

        // crypto.randomUUID()
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        const [genreResult] = await connection.query(
            'SELECT id FROM genre WHERE LOWER(name) IN (?);',
            [genreInput]
        )//Obtenemos los id de los generos de la pelicula en el string genreResult

        function uuidToBin(uuid) { //FUNCION PARA CONVERTIR UUID a BIN Para ingresarlo a la tabla movie_genre
            const hex = uuid.replace(/-/g, '');
            return Buffer.from(hex, 'hex');
        }
        const movieBin = uuidToBin(uuid) // Convertimos el UUID a BIN

        try {
        await connection.query(
            `INSERT INTO movie (id, title, year, director, duration, poster, rate)
            VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
            [title, year, director, duration, poster, rate]
        )

        const genreIds = genreResult.map(g => g.id) // [id1, id2, ...]
        const values = genreIds.map( genreId => [movieBin,genreId]) // [[movieBin, id1], [movieBin, id2], ...]
        await connection.query(
            `INSERT INTO movie_genres (movie_id, genre_id)
            VALUES ?`,
            [values]
        );
        } catch (e) {
        // puede enviarle información sensible
            throw new Error('Error creating movie')
        // enviar la traza a un servicio interno
        // sendLog(e)
        }


        
        const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(id) id,title, year, director, duration, poster, rate
        FROM movie
        WHERE id = UUID_TO_BIN(?)
        `,
        [uuid]
        )

        return { ...movies[0]  , genreInput} 
    }

    static async update ({id, input}) {

    }

    static async delete ({id}) {
       try {
        await connection.query(
                'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
                [id]
            )
        await connection.query(
            'DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);',
            [id]
        )
            return true
        } catch (error) {
                throw new Error('Error deleting movie')
        }

    }
}