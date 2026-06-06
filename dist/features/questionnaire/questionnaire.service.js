"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCompletionService = exports.getResponsesService = exports.submitResponseService = exports.deleteQuestionnaireService = exports.updateQuestionnaireService = exports.getQuestionnaireByIdService = exports.getQuestionnairesService = exports.createQuestionnaireService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createQuestionnaireService = async (data) => {
    // Check if any questionnaire already exists
    const existing = await prisma_1.prisma.questionnaire.findFirst({ select: { id: true } });
    if (existing) {
        // If exists, automatically update the existing one instead of creating a new one
        return (0, exports.updateQuestionnaireService)(existing.id, data);
    }
    const { pages, ...rest } = data;
    const result = await prisma_1.prisma.questionnaire.create({
        data: {
            ...rest,
            pages: {
                create: pages?.map((page) => ({
                    title: page.title,
                    description: page.description,
                    order: page.order,
                    questions: {
                        create: page.questions.map((q) => ({
                            type: q.type,
                            label: q.label,
                            placeholder: q.placeholder,
                            isRequired: q.isRequired,
                            order: q.order,
                            options: {
                                create: q.options?.map((opt) => ({
                                    label: opt.label,
                                    value: opt.value,
                                    order: opt.order,
                                })),
                            },
                        })),
                    },
                })),
            },
        },
        include: {
            pages: {
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            },
        },
    });
    return result;
};
exports.createQuestionnaireService = createQuestionnaireService;
const getQuestionnairesService = async (storeId) => {
    const result = await prisma_1.prisma.questionnaire.findMany({
        where: {
            ...(storeId ? { storeId } : {}),
        },
        include: {
            _count: {
                select: {
                    pages: true,
                    responses: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
exports.getQuestionnairesService = getQuestionnairesService;
const getQuestionnaireByIdService = async (id) => {
    const result = await prisma_1.prisma.questionnaire.findUnique({
        where: { id },
        include: {
            pages: {
                orderBy: { order: "asc" },
                include: {
                    questions: {
                        orderBy: { order: "asc" },
                        include: {
                            options: { orderBy: { order: "asc" } },
                        },
                    },
                },
            },
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getQuestionnaireByIdService = getQuestionnaireByIdService;
const updateQuestionnaireService = async (id, data) => {
    const existing = await prisma_1.prisma.questionnaire.findUnique({
        where: { id },
        include: {
            pages: {
                include: {
                    questions: {
                        include: { options: true }
                    }
                }
            }
        }
    });
    if (!existing) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const { pages, ...rest } = data;
    return await prisma_1.prisma.$transaction(async (tx) => {
        // 1. Update main questionnaire
        const updatedQuestionnaire = await tx.questionnaire.update({
            where: { id },
            data: rest,
        });
        if (pages) {
            // 2. Sync Pages
            const inputPageIds = pages.map(p => p.id).filter(Boolean);
            // Delete pages not in input
            await tx.questionnairePage.deleteMany({
                where: {
                    questionnaireId: id,
                    id: { notIn: inputPageIds }
                }
            });
            for (const page of pages) {
                let pageId = page.id;
                if (pageId) {
                    await tx.questionnairePage.update({
                        where: { id: pageId },
                        data: {
                            title: page.title,
                            description: page.description,
                            order: page.order,
                        }
                    });
                }
                else {
                    const newPage = await tx.questionnairePage.create({
                        data: {
                            questionnaireId: id,
                            title: page.title,
                            description: page.description,
                            order: page.order,
                        }
                    });
                    pageId = newPage.id;
                }
                // 3. Sync Questions
                const inputQuestionIds = page.questions.map(q => q.id).filter(Boolean);
                await tx.question.deleteMany({
                    where: {
                        pageId: pageId,
                        id: { notIn: inputQuestionIds }
                    }
                });
                for (const q of page.questions) {
                    let qId = q.id;
                    const { options, ...qRest } = q;
                    if (qId) {
                        await tx.question.update({
                            where: { id: qId },
                            data: {
                                type: qRest.type,
                                label: qRest.label,
                                placeholder: qRest.placeholder,
                                isRequired: qRest.isRequired,
                                order: qRest.order,
                            }
                        });
                    }
                    else {
                        const newQ = await tx.question.create({
                            data: {
                                pageId: pageId,
                                ...qRest,
                            }
                        });
                        qId = newQ.id;
                    }
                    // 4. Sync Options
                    if (options) {
                        const inputOptionIds = options.map(o => o.id).filter(Boolean);
                        await tx.questionOption.deleteMany({
                            where: {
                                questionId: qId,
                                id: { notIn: inputOptionIds }
                            }
                        });
                        for (const opt of options) {
                            if (opt.id) {
                                await tx.questionOption.update({
                                    where: { id: opt.id },
                                    data: {
                                        label: opt.label,
                                        value: opt.value,
                                        order: opt.order,
                                    }
                                });
                            }
                            else {
                                await tx.questionOption.create({
                                    data: {
                                        questionId: qId,
                                        label: opt.label,
                                        value: opt.value,
                                        order: opt.order,
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        return updatedQuestionnaire;
    });
};
exports.updateQuestionnaireService = updateQuestionnaireService;
const deleteQuestionnaireService = async (id) => {
    const existing = await prisma_1.prisma.questionnaire.findUnique({ where: { id } });
    if (!existing) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.questionnaire.delete({ where: { id } });
    return { id, message: "Questionnaire deleted successfully" };
};
exports.deleteQuestionnaireService = deleteQuestionnaireService;
const submitResponseService = async (data) => {
    const { questionnaireId, storeId, answers } = data;
    const result = await prisma_1.prisma.questionnaireResponse.create({
        data: {
            questionnaireId,
            storeId,
            answers: {
                create: answers.map((ans) => ({
                    questionId: ans.questionId,
                    value: ans.value,
                })),
            },
        },
        include: {
            answers: true,
        },
    });
    return result;
};
exports.submitResponseService = submitResponseService;
const getResponsesService = async (questionnaireId) => {
    const result = await prisma_1.prisma.questionnaireResponse.findMany({
        where: { questionnaireId },
        include: {
            user: { select: { id: true, userName: true } },
            member: { select: { id: true, name: true } },
            answers: {
                include: {
                    question: { select: { label: true, type: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
exports.getResponsesService = getResponsesService;
const checkCompletionService = async (storeId) => {
    const response = await prisma_1.prisma.questionnaireResponse.findFirst({
        where: { storeId },
    });
    return { completed: !!response };
};
exports.checkCompletionService = checkCompletionService;
