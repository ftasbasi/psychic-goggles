# psychic-goggles

A simple script that redelivers GitHub Webhook events using GitHub REST API

You may try retrieving your repository webhooks via following command before using the script for getting correct parameters especially hook_id:
curl -i -u username:GitHubToken -H "Accept: application/vnd.github.v3+json" `https://api.github.com/repositories/{repository name or id}/hooks/{hookname or id}/deliveries?per_page={page count}`

Useful links and reads:

https://docs.github.com/en/rest

https://github.com/octokit/core.js#hooks

https://docs.github.com/en/github-ae@latest/rest/guides/traversing-with-pagination

https://docs.github.com/en/github-ae@latest/rest/overview/resources-in-the-rest-api