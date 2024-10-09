﻿using FastEndpoints;
using Rendalicce.Infrastructure.Authentication;

namespace Rendalicce.Features.App.Account;

public sealed class GetAccountInformation
{
    public sealed record GetAccountInformationResult(string FirstName, string LastName, string Email);

    public sealed class GetAccountInformationEndpoint : EndpointWithoutRequest<GetAccountInformationResult>
    {
        public override void Configure()
        {
            Get("account");
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var user = HttpContext.GetAuthenticatedUserOrNull()!;
            await SendAsync(new GetAccountInformationResult(
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email), cancellation: ct);
        }
    }
}