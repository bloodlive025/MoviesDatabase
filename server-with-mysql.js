import { createApp } from "./app.js";  

import { MovieModel } from "./models/database/movies.js";

createApp({ movieModel: MovieModel });