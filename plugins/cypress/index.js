import { NetlifyAPI } from "netlify";
import cypress from "cypress";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line no-console
const client = new NetlifyAPI(process.env.NETLIFY_TOKEN);
// eslint-disable-next-line no-console

const config = {
  onPreBuild: () => {},

  onSuccess: async ({ netlifyConfig, utils }) => {
    const result = await cypress.run({
      config: {
        baseUrl: netlifyConfig.build.environment.DEPLOY_PRIME_URL,
      },
      spec: "./cypress/e2e/**/**.cy.ts",
      env: {
        access_token: process.env.CYPRESS_ACCESS_TOKEN,
      },
    });

    const summary = [
      "tests:",
      `✅ ${result.totalPassed}`,
      `🔥 ${result.totalFailed}`,
      `⭕️ ${result.totalPending}`,
      `🚫 ${result.totalSkipped}`,
    ];

    let text = `
      ✅ Passed tests: ${result.totalPassed}
      🔥 Failed tests: ${result.totalFailed}
      ⭕️ Pending tests: ${result.totalPending}
      🚫 Skipped tests: ${result.totalSkipped}
  `;

    // eslint-disable-next-line no-console
    console.log(text);

    utils.status.show({
      title: "cypress plugin",
      summary: summary.join(" "),
      text,
    });

    const sha = utils.git.commits[0].sha;
    const authorization = `token ${netlifyConfig.build.environment.GITHUB_TOKEN}`;
    const deployURL = netlifyConfig.build.environment.DEPLOY_PRIME_URL;

    if (result.totalFailed > 0) {
      const deploy = await client.getDeploy({
        site_id: process.env.SITE_ID,
        deploy_id: process.env.DEPLOY_ID,
      });

      // eslint-disable-next-line no-console
      console.log("Preivew sitedeploy:", deploy);

      const response = await fetch(
        `https://api.github.com/repos/nathanvale/jazz-chord-app/statuses/${sha}`,
        {
          method: "POST",
          headers: {
            authorization,
          },
          body: JSON.stringify({
            state: "failure",
            target_url: deployURL,
            context: "Cypress",
            description: `${result.totalFailed} Cypress tests failed}`,
          }),
        }
      );

      const data = await response.json();
      const { status, statusText, ok } = response;

      if (!ok) {
        const error = new Error(`${status} ${statusText}`);
        error.data = data;
        throw error;
      }
      return data;
    } else {
      const response = await fetch(
        `https://api.github.com/repos/nathanvale/jazz-chord-app/statuses/${sha}`,
        {
          method: "POST",
          headers: {
            authorization,
          },
          body: JSON.stringify({
            state: "success",
            target_url: deployURL,
            context: "Cypress",
            description: `Cypress tests passed.`,
          }),
        }
      );
      const data = await response.json();
      const { status, statusText, ok } = response;

      if (!ok) {
        const error = new Error(`${status} ${statusText}`);
        error.data = data;
        throw error;
      }
      return data;
    }
  },
};

export default config;
