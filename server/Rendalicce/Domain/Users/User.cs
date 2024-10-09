﻿using System.Security.Cryptography;
using System.Text;

namespace Rendalicce.Domain.Users;

public sealed class User : Entity
{
    private User() { }
    
    public string FirstName { get; private set; } = null!;
    public string LastName { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    private string PasswordHash { get; set; } = null!;

    public static User Initialize(string firstName, string lastName, string email, string password)
    {
        return new User
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = HashPassword(password)
        };
    }

    public void Update(string firstName, string lastName, string email)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
    
    public void SetPassword(string password) => PasswordHash = HashPassword(password);
    public bool IsCorrectPassword(string password) => HashPassword(password) == PasswordHash;
    private static string HashPassword(string password) => BitConverter.ToString(SHA512.HashData(Encoding.UTF8.GetBytes(password))).Replace("-", string.Empty);
}