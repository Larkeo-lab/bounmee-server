"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitResponseSchema = exports.AnswerSchema = exports.UpdateQuestionnaireSchema = exports.CreateQuestionnaireSchema = exports.QuestionnairePageSchema = exports.QuestionSchema = exports.QuestionOptionSchema = exports.QuestionTypeEnum = void 0;
const zod_1 = require("zod");
exports.QuestionTypeEnum = zod_1.z.enum([
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "SELECT",
    "RADIO",
    "CHECKBOX",
    "DATE",
]);
exports.QuestionOptionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    label: zod_1.z.string(),
    value: zod_1.z.string(),
    order: zod_1.z.number().optional().default(0),
});
exports.QuestionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    type: exports.QuestionTypeEnum,
    label: zod_1.z.string(),
    placeholder: zod_1.z.string().optional(),
    isRequired: zod_1.z.boolean().optional().default(false),
    order: zod_1.z.number().optional().default(0),
    options: zod_1.z.array(exports.QuestionOptionSchema).optional(),
});
exports.QuestionnairePageSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    order: zod_1.z.number().optional().default(0),
    questions: zod_1.z.array(exports.QuestionSchema),
});
exports.CreateQuestionnaireSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
    pages: zod_1.z.array(exports.QuestionnairePageSchema).optional(),
});
exports.UpdateQuestionnaireSchema = exports.CreateQuestionnaireSchema.partial();
exports.AnswerSchema = zod_1.z.object({
    questionId: zod_1.z.string().uuid(),
    value: zod_1.z.string().optional(),
});
exports.SubmitResponseSchema = zod_1.z.object({
    questionnaireId: zod_1.z.string().uuid(),
    storeId: zod_1.z.string().uuid(),
    answers: zod_1.z.array(exports.AnswerSchema),
});
