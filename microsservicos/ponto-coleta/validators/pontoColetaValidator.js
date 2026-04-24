const { cpf, cnpj } = require("cpf-cnpj-validator");
const { z } = require("zod");

function onlyDigits(value) {
    return value.replace(/\D/g, "");
}

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const addressSchema = z.object({
    street: z.string().trim().min(3, "street e obrigatorio"),
    number: z.string().trim().min(1, "number e obrigatorio"),
    complement: z.string().trim().max(100).optional().or(z.literal("")),
    district: z.string().trim().min(2, "district e obrigatorio"),
    city: z.string().trim().min(2, "city e obrigatorio"),
    postCode: z
        .string()
        .transform(onlyDigits)
        .refine((value) => value.length === 8, "postCode deve ter 8 digitos"),
});

const createPointSchema = z.object({
    opensPc: z.boolean(),
    nameUser: z.string().trim().min(3, "nameUser e obrigatorio"),
    linkPhoto: z.string().trim().url("linkPhoto deve ser uma URL valida"),
    cpfUser: z
        .string()
        .transform(onlyDigits)
        .refine((value) => cpf.isValid(value), "cpfUser invalido"),
    cpnjPoint: z
        .string()
        .transform(onlyDigits)
        .refine((value) => cnpj.isValid(value), "cpnjPoint invalido"),
    emailUser: z.string().trim().email("emailUser invalido"),
    celUser: z
        .string()
        .transform(onlyDigits)
        .refine((value) => value.length >= 10 && value.length <= 11, "celUser invalido"),
    namePoint: z.string().trim().min(3, "namePoint e obrigatorio"),
    hourInit: z.string().trim().regex(timeRegex, "hourInit deve estar em HH:mm"),
    hour: z.string().trim().regex(timeRegex, "hour deve estar em HH:mm"),
    address: addressSchema,
});

const updatePointSchema = createPointSchema.partial();

const reviewSchema = z.object({
    decision: z.enum(["APPROVE", "REJECT"]),
    reason: z.string().trim().max(255).optional(),
});

function validateCreate(payload) {
    return createPointSchema.parse(payload);
}

function validateUpdate(payload) {
    const parsed = updatePointSchema.parse(payload);
    if (Object.keys(parsed).length === 0) {
        const error = new Error("Informe ao menos um campo para atualizar");
        error.statusCode = 400;
        throw error;
    }
    return parsed;
}

function validateReview(payload) {
    return reviewSchema.parse(payload);
}

module.exports = {
    validateCreate,
    validateUpdate,
    validateReview,
};
