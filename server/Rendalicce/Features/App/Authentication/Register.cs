﻿using FastEndpoints;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Rendalicce.Domain.Users;
using Rendalicce.Infrastructure.Authentication;
using Rendalicce.Persistency;

namespace Rendalicce.Features.App.Authentication;

public sealed class Register
{
    public sealed record RegisterRequest(string FirstName, string LastName, string Email, string Password);
    public sealed record RegisterResult(string Token);

    public sealed class RegisterEndpoint(DatabaseContext databaseContext, AuthenticationProvider authenticationProvider)
        : Endpoint<RegisterRequest, RegisterResult>
    {
        public override void Configure()
        {
            AllowAnonymous();
            Post("auth/register");
        }

        public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
        {
            var existingUser = await databaseContext.Users.FirstOrDefaultAsync(u => u.Email == req.Email, ct);
            if (existingUser is not null)
                ThrowError("Email is already in use.");
            
            var user = Domain.Users.User.Initialize(req.FirstName, req.LastName, req.Email, req.Password);
            
            databaseContext.Users.Add(user);
            await databaseContext.SaveChangesAsync(ct);

            await SendAsync(new RegisterResult(authenticationProvider.GenerateJwtToken(user)), cancellation: ct);
        }
    }

    public sealed class RegisterRequestValidator : Validator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(r => r.FirstName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("First name cannot be empty.")
                .MaximumLength(63).WithMessage("First name must have length less than 63 characters.");
            
            RuleFor(r => r.LastName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Last name cannot be empty.")
                .MaximumLength(63).WithMessage("Last name must have length less than 63 characters.");

            RuleFor(r => r.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress().WithMessage("Invalid email address.");
            
            RuleFor(r => r.Password).SetValidator(new PasswordValidator());
        }
    }
}