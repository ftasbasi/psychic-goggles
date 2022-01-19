# psychic-goggles

A simple script that redelivers GitHub Webhook events using GitHub REST API

You may try retrieving your repository webhooks via following command before using the script for getting correct parameters especially hook_id:
curl -i -u username:GitHubToken -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repositories/repositoryname_or_id/hooks/hookname_or_id/deliveries?per_page=10"