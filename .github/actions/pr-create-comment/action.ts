/* eslint-env node */

import core from '@actions/core';
import github from '@actions/github';

interface Options {
  content: string;
  replace: boolean;
  tag: string;
}

const token = core.getInput('github-token');
const octokit = github.getOctokit(token);

async function run(options: Options): Promise<void> {
  const { content, replace, tag } = options;

  if (replace) {
    core.info(`Fetching previous comments`);

    const { data: comments } = await octokit.rest.issues.listComments({
      ...github.context.repo, issue_number: github.context.issue.number,
    });

    core.info(`Fetched: ${comments.length}`);

    const matchingComments = comments.filter(comment => comment.body?.includes(tag));
    core.info(`Matching: ${matchingComments.length}`);

    for (const comment of matchingComments) {
      core.info(`Deleting previous comment: ${comment.id}`);

      await octokit.rest.issues.deleteComment({
        ...github.context.repo, comment_id: comment.id,
      });
    }
  }

  const body = `${tag} \n\n ${content}`;
  core.info(`Creating comment: \n\n ${body}`);

  await octokit.rest.issues.createComment({
    ...github.context.repo, body, issue_number: github.context.issue.number,
  });
}

export {
  run,
};
