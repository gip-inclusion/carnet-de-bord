/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type Je = typeof import('./steps_file');
type Downloads = import('./step_definitions/downloads_helper.js');
type Seed = import('./step_definitions/seed_helper.js');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, Je: Je }
  interface Methods extends Downloads, FileSystem, GraphQL, JSONResponse, Playwright, REST, Seed {}
  interface I extends ReturnType<steps_file>, WithTranslation<Downloads>, WithTranslation<FileSystem>, WithTranslation<GraphQL>, WithTranslation<JSONResponse>, WithTranslation<Seed> {}
  namespace Translation {
    interface Actions {}
  }
}
