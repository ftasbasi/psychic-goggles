"use strict";
const fs = require("fs");
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: `PUT GITHUB TOKEN HERE` });
const date_limit=Date.parse('2021-11-01T00:01:00Z'); // redelivery begin time
function isBefore(dateIn)
{
    return date_limit<Date.parse(dateIn);
}
async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}
async function redeliver(ownerName, repoName,hookID,deliveryID) {
  
  const res= await octokit.request('POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts', {
    owner: ownerName,
    repo: repoName,
    hook_id: hookID,
    delivery_id: deliveryID
  });
  await sleep(5000);
  return res;
}
async function postDelivery(ownerName, repoName,hookID,element){
  let redeliveryResponse;
  if(element.status=="OK" && isBefore(element.delivered_at)){
    if((element.event=="workflow_job" && element.action=="completed") || (element.event=="pull_request" && element.action=="closed") || (element.event=="push")){
      redeliveryResponse=await redeliver(ownerName, repoName,hookID,element.id);
    }
  }
  return redeliveryResponse;
}

// Start function
const start = async function(ownerName, repoName,hookID) {
  let cursor;
  let link;
  let link_url;
  let subResponse;
  let response = await octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries?per_page={item_count}', {
    owner: ownerName,
    repo: repoName,
    hook_id: hookID,
    item_count: 10
  })

  link=response.headers.link
  link_url = link.substring(
    link.indexOf("<") + 1, 
    link.indexOf(">")
    );
    while(response.headers.link.search("next")){
      cursor=link_url.substring(link_url.indexOf("cursor=")+7,link_url.length);
    
      response = await octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries?per_page={item_count}&cursor={cursor_name}', {
        owner: ownerName,
        repo: repoName,
        hook_id: hookID,
        item_count: 10,
        cursor_name: cursor
      })

      response.data.forEach(element => {
        subResponse = postDelivery(ownerName,repoName,hookID,element);
        console.log(subResponse);
      }); 
      /* you may save event lists to a file with this block
      fs.appendFile('output.txt', JSON.stringify(response.data), function (err) {
        if (err) return console.log(err);
      });
      */
      link=response.headers.link
      link_url = link.substring(
        link.indexOf("<") + 1, 
        link.indexOf(">")
        );
    }
}

start('ftasbasi','Scripts',111111111);
