// centralized error handler
export default function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    console.error("ERROR:", err && err.stack ? err.stack : err);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        success: false,
        error: message,
        details: err.details || undefined,
    });
}
