#! /usr/bin/env node
import { program } from "commander";
import { handleExit } from "./utils/exit";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as prompts from '@clack/prompts';

const execAsync = promisify(exec);

process.on('SIGINT', () => handleExit('cancelled'));
process.on('SIGTSTP', () => handleExit('paused'));

const REPO_URL = 'https://github.com/himonshuuu/bearn-cli.git';
const templates = [
    {
        value: 'ts-traditional',
        label: 'TypeScript'
    },
    {
        value: 'js-traditional',
        label: 'JavaScript'
    },
    {
        value: 'ts-decorator',
        label: 'TypeScript with decorators'
    },
];

const init = async (projectName?: string) => {
    try {
        console.log('Welcome to Bearn CLI');

        if (!projectName) {
            const response = await prompts.text({
                message: 'Project name',
                validate: (name: string): string | undefined => {
                    if (!name) {
                        return 'Project name is required';
                    }
                    if (fs.existsSync(name)) {
                        return 'Directory already exists';
                    }
                    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
                        return 'Project name can only contain letters, numbers, dashes and underscores';
                    }
                    return undefined;
                }
            });

            if (prompts.isCancel(response)) {
                handleExit('cancelled');
            }

            projectName = response as string;
        }

        if (fs.existsSync(projectName)) {
            console.error('Error: Directory already exists');
            process.exit(1);
        }

        fs.mkdirSync(projectName);
        process.chdir(projectName);

        const tmpDir = path.join(os.tmpdir(), 'bearn-cli-' + Math.random().toString(36).substring(7));
        fs.mkdirSync(tmpDir, { recursive: true });

        console.log('Fetching templates...');
        try {
            await execAsync(`git clone --depth 1 ${REPO_URL} "${tmpDir}"`);
        } catch (error) {
            console.error('Failed to clone repository:', error);
            fs.rmSync(projectName, { recursive: true, force: true });
            process.exit(1);
        }

        const template = await prompts.select({
            message: 'Select a template',
            options: templates
        });

        if (prompts.isCancel(template)) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
            fs.rmSync(projectName, { recursive: true, force: true });
            handleExit('cancelled');
        }

        try {
            fs.cpSync(path.join(tmpDir, 'templates', template as string), '.', { recursive: true });
        } catch (error) {
            console.error('Failed to copy template:', error);
            fs.rmSync(tmpDir, { recursive: true, force: true });
            fs.rmSync(projectName, { recursive: true, force: true });
            process.exit(1);
        }

        fs.rmSync(tmpDir, { recursive: true, force: true });

        const pkgPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                pkg.name = projectName;
                fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
            } catch (error) {
                console.error('Failed to update package.json:', error);
                fs.rmSync(projectName, { recursive: true, force: true });
                process.exit(1);
            }
        }

        console.log('\nSetup complete! 🎉');
        console.log(`\nNext steps:`);
        console.log(`  cd ${projectName}`);
        console.log(`  npm install`);
        console.log(`  npm run dev`);

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        if (projectName && fs.existsSync(projectName)) {
            fs.rmSync(projectName, { recursive: true, force: true });
        }
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