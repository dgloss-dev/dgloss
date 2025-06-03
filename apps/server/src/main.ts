// App.ts
import { AppConfig } from './config';

import { ExpressLoader, SQLLoader } from './loaders';
import { HttpServer } from './servers';

class App {
  private httpServer: HttpServer;

  constructor() {
    this.httpServer = new HttpServer();
    this.loadLoaders();
  }

  private loadLoaders(): void {
    const expressLoader = new ExpressLoader(this.httpServer.getApp());
    const db = SQLLoader.getInstance();
    expressLoader.load();
    db.getSequelizeInstance()?.sync();
  }

  public startServer(): void {
    const port = AppConfig.APP_PORT;
    this.httpServer.listen(port, () => {
      console.log(`✅ Server started successfully on port ${port}!`);
    });
  }
}

const app = new App();
app.startServer();
