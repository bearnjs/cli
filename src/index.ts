import { program } from "commander";
import * as prompts from '@clack/prompts';


const handleExit = (message: string) => {
    console.log(`\nOperation ${message}`);
    process.exit(0);
};

process.on('SIGINT', () => handleExit('cancelled'));
process.on('SIGTSTP', () => handleExit('paused'));


type QuestionType = 'text' | 'select' | 'confirm';

interface BaseQuestion {
    type: QuestionType;
    name: string;
    message: string;
}

interface TextQuestion extends BaseQuestion {
    type: 'text';
    validate?: (value: string) => boolean | string;
}

interface SelectQuestion extends BaseQuestion {
    type: 'select';
    options: Array<{ value: string; label: string }>;
}

interface ConfirmQuestion extends BaseQuestion {
    type: 'confirm';
}

type Question = TextQuestion | SelectQuestion | ConfirmQuestion;

const questions: Question[] = [
    {
        type: "text",
        name: "name",
        message: "Project name: ",
        validate: (value: string) => value ? true : "Project name is required"
    },
    {
        type: "select",
        name: "packageManager",
        message: "Package manager",
        options: [
            { value: "npm", label: "npm" },
            { value: "yarn", label: "yarn" },
            { value: "pnpm", label: "pnpm" },
            { value: "bun", label: "bun" }
        ]
    },
    {
        type: "select",
        name: "language",
        message: "Language",
        options: [
            { value: "TypeScript", label: "TypeScript" },
            { value: "JavaScript", label: "JavaScript" }
        ]
    },
    {
        type: "confirm",
        name: "setupLinting",
        message: "Do you want ESLint & Prettier setup?"
    },
    {
        type: "confirm",
        name: "dockerSupport",
        message: "Do you want Docker support?"
    },
    {
        type: "select",
        name: "envConfig",
        message: "Environment config style",
        options: [
            { value: ".env", label: ".env" },
            { value: "JSON", label: "JSON" },
            { value: "YAML", label: "YAML" }
        ]
    },
    {
        type: "select",
        name: "routingStyle",
        message: "Routing style",
        options: [
            { value: "file-based", label: "file-based" },
            { value: "decorators", label: "decorators" }
        ]
    },
    {
        type: "select",
        name: "orm",
        message: "ORM integration",
        options: [
            { value: "Prisma", label: "Prisma" },
            { value: "TypeORM", label: "TypeORM" },
            { value: "None", label: "None" }
        ]
    },
    {
        type: "confirm",
        name: "initGit",
        message: "Initialize git repository?"
    },
    {
        type: "confirm",
        name: "installDeps",
        message: "Install dependencies now?"
    }
];

const promptQuestion = async (question: Question): Promise<any> => {
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

const init = async (projectName?: string) => {
    try {
        console.log('Welcome to Bearn CLI');

        const answers: Record<string, any> = {};
        if (projectName) {
            answers.name = projectName;
            console.log(`Project name provided: ${projectName}`);
        }

        for (const question of questions) {
            if (question.name === 'name' && projectName) {
                continue;
            }

            const answer = await promptQuestion(question);

            if (prompts.isCancel(answer)) {
                handleExit('cancelled');
            }

            answers[question.name] = answer;
        }

        console.log('\nProject configuration:');
        console.log(JSON.stringify(answers, null, 2));
        console.log('\nTODO: Implementation of project scaffolding based on answers');
        console.log('Setup complete!');

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        process.exit(1);
    }
};

program
    .version("0.0.1")
    .description("Bearn CLI")
    .command("init [name]")
    .description("Initialize a new Bearn project")
    .action(init);

program.parse(process.argv);