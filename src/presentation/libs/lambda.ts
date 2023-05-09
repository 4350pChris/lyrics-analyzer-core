/* eslint-disable @typescript-eslint/no-unsafe-argument */
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

// @ts-expect-error Trying to type this ends up making a type that never resolves, maybe fix this later
export const middyfy = handler => middy(handler).use(middyJsonBodyParser());
