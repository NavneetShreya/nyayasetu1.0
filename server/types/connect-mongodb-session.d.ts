declare module 'connect-mongodb-session' {
  import session from 'express-session';
  
  function create(session: typeof import('express-session')): {
    new (options: {
      uri: string;
      collection?: string;
      expires?: number;
      connectionOptions?: any;
    }): session.Store;
  };
  
  export = create;
}