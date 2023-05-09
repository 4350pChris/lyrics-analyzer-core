import {cwd} from 'node:process';

export const handlerPath = (context: string) => `${context.split(cwd())[1].slice(1).replace(/\\/g, '/')}`;
