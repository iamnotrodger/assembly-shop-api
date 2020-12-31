import 'dotenv/config';
import app from './app';

//TODO: verify if the environment variable has been set.

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on the port ${port}`);
});
