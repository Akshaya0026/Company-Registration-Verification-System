import { validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const mapped = errors.array().map(e => ({ field: e.param, msg: e.msg }));
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = mapped;
    return next(err);
};
