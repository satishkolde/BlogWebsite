export const errorHandler = (err, _, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send({
        message: message,
        ...err
    });
}