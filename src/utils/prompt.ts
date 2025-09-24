import { Question } from "../questions";
import * as prompts from '@clack/prompts';
import { handleExit } from "./exit";

export const startPrompt = async (question: Question): Promise<any> => {
    switch (question.type) {
        case 'text':
            return prompts.text({
                message: question.message,
                validate: question.validate ? (value: string) => {
                    const result = question.validate!(value);
                    return result === true ? undefined : result as string | Error | undefined;
                } : undefined
            });
        case 'select':
            return prompts.select({
                message: question.message,
                options: question.options
            });
        case 'confirm':
            return prompts.confirm({
                message: question.message
            });
    }

};

export const promptQuestions = async (questions: Question[], projectName?: string): Promise<Record<string, any>> => {
    const answers: Record<string, any> = {};
    for (const question of questions) {
        if (question.name === 'name' && projectName) {
            continue;
        }
        const answer = await startPrompt(question);
        if (prompts.isCancel(answer)) {
            handleExit('cancelled');
        }
        answers[question.name] = answer;
    }
    return answers;
};
