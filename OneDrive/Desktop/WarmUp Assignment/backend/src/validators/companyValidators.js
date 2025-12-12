import { body, param } from "express-validator";

export const createCompanyValidator = [
    body("company_name")
        .trim()
        .notEmpty()
        .withMessage("company_name is required")
        .isLength({ max: 255 }).withMessage("company_name too long"),
    body("address").optional().isLength({ max: 1000 }).withMessage("address too long"),
    body("city").optional().trim().isLength({ max: 100 }).withMessage("city too long"),
    body("state").optional().trim().isLength({ max: 100 }).withMessage("state too long"),
    body("country").optional().trim().isLength({ max: 100 }).withMessage("country too long"),
    body("postal_code").optional().trim().isLength({ max: 20 }).withMessage("postal_code too long"),
    body("website").optional().isURL({ require_protocol: true }).withMessage("website must be a valid URL including protocol (https://)"),
];

export const updateCompanyValidator = [
    param("id").isInt().withMessage("Invalid company id"),
    body()
        .custom((value) => {
            const allowed = ["company_name","address","city","state","country","postal_code","website"];
            const keys = Object.keys(value).filter(k => allowed.includes(k));
            if (keys.length === 0) throw new Error("No valid fields provided for update");
            return true;
        }),
    body("company_name").optional().trim().isLength({ max: 255 }),
    body("website").optional().isURL({ require_protocol: true }).withMessage("website must be a valid URL including protocol (https://)"),
];

export const idParamValidator = [
    param("id").isInt().withMessage("Invalid id parameter")
];
