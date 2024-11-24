import logger from "./logger.ts";
import config from "./config.ts";

class ApiTest {
  private intervalId:NodeJS.Timeout | null = null;

  public startRequestInterval(url:string,timeInMs:number) {
    this.intervalId = setInterval(() => this.makeRequest(url), timeInMs);
  }

  private async makeRequest(url:string) {
    try {
      await fetch(url);
    } catch (err: unknown) {
      logger.error(err);
      if(this.intervalId)
      clearInterval(this.intervalId);
    }
  }
}





function setApiTestRequestInterval() {
  const { host, port } = config.getServerConfig();
    const { env } = config.getEnvConfig();
    const baseUrl =
      env == "PROD" ? `https://${host}:${port}` : `http://${host}:${port}`;  
  const apiTest = new ApiTest();
  const time = 1000 * 60 * 10; // 10 minutes
  apiTest.startRequestInterval(baseUrl, time);
}


export default setApiTestRequestInterval;