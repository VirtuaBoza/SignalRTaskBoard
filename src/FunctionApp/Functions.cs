using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace Company.Function
{
  public static class Functions
  {
    [FunctionName("negotiate")]
    public static SignalRConnectionInfo GetSignalRInfo(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequest req,
        [SignalRConnectionInfo(HubName = "azureTaskHub")]SignalRConnectionInfo connectionInfo)
    {
      return connectionInfo;
    }

    [FunctionName("delete")]
    public static Task DeleteWorkItem(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "delete/{workItemId}")]HttpRequest req,
        string workItemId,
        [SignalR(HubName = "azureTaskHub")]IAsyncCollector<SignalRMessage> signalRMessages)
    {
      return signalRMessages.AddAsync(
        new SignalRMessage
        {
          Target = "DeleteWorkItem",
          Arguments = new[] { workItemId }
        });
    }
  }
}
