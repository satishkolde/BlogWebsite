import { app } from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.on("error", (err) => {
        console.log("Error Encountered: ",err);
    });

    app.listen(PORT, () => {
        console.log("Server is listening on port: ", PORT);
    });
}).catch((err) => {
    console.log("Internal Server Error while connecting to DB", err);
});