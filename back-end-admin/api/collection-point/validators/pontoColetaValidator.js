const { cpf, cnpj } = require("cpf-cnpj-validator");
const { z } = require("zod");

function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
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
    nameUser: z.string().trim().min(3, "nameUser e obrigatorio"),
    cpfUser: z
        .string()
        .transform(onlyDigits)
        .refine((value) => cpf.isValid(value), "cpfUser invalido"),
    celUser: z
        .string()
        .transform(onlyDigits)
        .refine((value) => value.length >= 10 && value.length <= 11, "celUser invalido"),
    emailUser: z.string().trim().email("emailUser invalido"),
    linkPhoto: z.string().trim().url("linkPhoto deve ser uma URL valida"),
    namePoint: z.string().trim().min(3, "namePoint e obrigatorio"),
    cnpjPoint: z
        .string()
        .transform(onlyDigits)
        .refine((value) => cnpj.isValid(value), "cnpjPoint invalido"),
    opensDay: z.string().trim().min(3, "opensDay e obrigatorio"),
    hourInit: z.string().trim().regex(timeRegex, "hourInit deve estar em HH:mm"),
    hourFinal: z.string().trim().regex(timeRegex, "hourFinal deve estar em HH:mm"),
    address: addressSchema,
});

const updatePointSchema = createPointSchema.partial().extend({
    address: addressSchema.partial().optional(),
});

const statusSchema = z.object({
    status: z.enum(["APROVADO", "REJEITADO"]),
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

function validateStatus(payload) {
    const parsed = statusSchema.parse(payload);

    if (parsed.status === "REJEITADO" && !parsed.reason) {
        const error = new Error("reason e obrigatorio quando o status for REJEITADO");
        error.statusCode = 400;
        throw error;
    }

    return parsed;
}

module.exports = {
    validateCreate,
    validateUpdate,
    validateStatus,
};
