import { app } from "./app.js";
import { sequelizeInstance } from "./db/index.js";

const PORT = process.env.PORT || 5000

sequelizeInstance.authenticate().then(() => {
    app.on("error", (err) => {
        console.log("Error Encountered: ",err);
    });
    console.log("Database connection was successfull");
    
    app.listen(PORT, () => {
        console.log("Server is listening on port: ", PORT);
    });
}).catch((err) => {
    console.log("Internal Server Error while connecting to DB", err);
});