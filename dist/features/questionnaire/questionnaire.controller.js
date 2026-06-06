"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCompletion = exports.getResponses = exports.submitResponse = exports.deleteQuestionnaire = exports.updateQuestionnaire = exports.getQuestionnaireById = exports.getQuestionnaires = exports.createQuestionnaire = void 0;
const questionnaire_service_1 = require("./questionnaire.service");
const questionnaire_validate_1 = require("./questionnaire.validate");
const common_validate_1 = require("../../shared/validations/common.validate");
const response_format_1 = require("../../shared/utils/response-format");
const createQuestionnaire = async (req, res) => {
    const data = questionnaire_validate_1.CreateQuestionnaireSchema.parse(req.body);
    const result = await (0, questionnaire_service_1.createQuestionnaireService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
};
exports.createQuestionnaire = createQuestionnaire;
const getQuestionnaires = async (req, res) => {
    const storeId = req.query.storeId;
    const result = await (0, questionnaire_service_1.getQuestionnairesService)(storeId);
    (0, response_format_1.ResponseManyDataSuccess)(res, result);
};
exports.getQuestionnaires = getQuestionnaires;
const getQuestionnaireById = async (req, res) => {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, questionnaire_service_1.getQuestionnaireByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
};
exports.getQuestionnaireById = getQuestionnaireById;
const updateQuestionnaire = async (req, res) => {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const data = questionnaire_validate_1.UpdateQuestionnaireSchema.parse(req.body);
    const result = await (0, questionnaire_service_1.updateQuestionnaireService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
};
exports.updateQuestionnaire = updateQuestionnaire;
const deleteQuestionnaire = async (req, res) => {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, questionnaire_service_1.deleteQuestionnaireService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
};
exports.deleteQuestionnaire = deleteQuestionnaire;
const submitResponse = async (req, res) => {
    const data = questionnaire_validate_1.SubmitResponseSchema.parse(req.body);
    const result = await (0, questionnaire_service_1.submitResponseService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
};
exports.submitResponse = submitResponse;
const getResponses = async (req, res) => {
    const { id } = common_validate_1.idSchema.parse(req.params); // questionnaireId
    const result = await (0, questionnaire_service_1.getResponsesService)(id);
    (0, response_format_1.ResponseManyDataSuccess)(res, result);
};
exports.getResponses = getResponses;
const checkCompletion = async (req, res) => {
    const { storeId } = common_validate_1.storeSchema.parse(req.body);
    const result = await (0, questionnaire_service_1.checkCompletionService)(storeId);
    (0, response_format_1.ResponseSuccess)(res, result);
};
exports.checkCompletion = checkCompletion;
