

export type QuestionType = 'text' | 'select' | 'confirm';

export interface BaseQuestion {
    type: QuestionType;
    name: string;
    message: string;
}
export interface TextQuestion extends BaseQuestion {
    type: 'text';
    validate?: (value: string) => boolean | string;
}

export interface SelectQuestion extends BaseQuestion {
    type: 'select';
    options: Array<{ value: string; label: string }>;
}

export interface ConfirmQuestion extends BaseQuestion {
    type: 'confirm';
}

export type Question = TextQuestion | SelectQuestion | ConfirmQuestion;


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