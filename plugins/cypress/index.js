import { NetlifyAPI } from "netlify";
import cypress from "cypress";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line no-console
const client = new NetlifyAPI(process.env.NETLIFY_TOKEN);
// eslint-disable-next-line no-console

const setGitStatus = async function ({
  netlifyConfig,
  utils,
  description,
  state,
}) {
  const sha = utils.git.commits[0].sha;
  const authorization = `token ${netlifyConfig.build.environment.GITHUB_TOKEN}`;
  const deployURL = netlifyConfig.build.environment.DEPLOY_PRIME_URL;
  const response = await fetch(
    `https://api.github.com/repos/nathanvale/jazz-chord-app/statuses/${sha}`,
    {
      method: "POST",
      headers: {
        authorization,
      },
      body: JSON.stringify({
        state,
        target_url: deployURL,
        context: "Cypress",
        description,
      }),
    }
  );

  return response;
};

const config = {
  onPreBuild: async ({ netlifyConfig, utils }) => {
    // eslint-disable-next-line no-console
    console.log("Context: ", netlifyConfig.build.environment.CONTEXT);
    if (netlifyConfig.build.environment.CONTEXT === "deploy-preview") {
      await setGitStatus({
        netlifyConfig,
        utils,
        description: `Cypress tests pending.`,
        state: "pending",
      });
    }
  },

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
      title: "Cypress tests",
      summary: summary.join(" "),
      text,
    });

    const deploy = await client.getDeploy({
      site_id: process.env.SITE_ID,
      deploy_id: process.env.DEPLOY_ID,
    });

    // eslint-disable-next-line no-console
    console.log("Deploy URL:", deploy.deploy_url);

    if (result.totalFailed > 0) {
      const response = await setGitStatus({
        netlifyConfig,
        utils,
        description: `${result.totalFailed} test(s) failed}`,
        state: "failure",
      });

      const data = await response.json();
      const { status, statusText, ok } = response;

      if (!ok) {
        const error = new Error(`${status} ${statusText}`);
        error.data = data;
        throw error;
      }
      return data;
    } else {
      await setGitStatus({
        netlifyConfig,
        utils,
        description: `Tests passed.`,
        state: "success",
      });
    }
  },
};

export default config;
