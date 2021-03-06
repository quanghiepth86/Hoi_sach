﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BC.Data.Repositories;
using BC.Infrastructure.Hash;
using BC.Auth;
using BC.Web.Constants;

namespace BookCommunity.Controllers
{
    [Produces("application/json")]
    [Route("api/admin/auth")]
    public class AuthController : Controller
    {
        private readonly IAdminUserRepository _adminUserRepository;
        private readonly IAuth _auth;
        private readonly ICryptography _cryptography;

        public AuthController(
            IAdminUserRepository adminUserRepository,
            IAuth auth,
            ICryptography cryptography)
        {
            _adminUserRepository = adminUserRepository;
            _auth = auth;
            _cryptography = cryptography;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UseCredential value)
        {
            Exception error = null;
            var adminUser = _adminUserRepository.GetByEmail(value.Email);
            if (adminUser == null)
            {
                error = new Exception(String.Format(ErrorMessage.EmailNotFound, value.Email));
                return BadRequest(error);
            }
            bool isLogin = _auth.Authenticated(adminUser.Password, value.Password);
            if (isLogin == false)
            {
                error = new Exception(ErrorMessage.PasswordNotCorrect);
                return BadRequest(error);
            }

            if (value.IsRemember == true)
            {
                adminUser.RememberToken = _cryptography.GenerateToken(adminUser.Id);
                await _adminUserRepository.Update(adminUser.Id, adminUser);
            }

            var token = _cryptography.Encrypt(adminUser.Id);
            HttpContext.Session.SetString(AuthKeys.AdminUserToken, token);
            var jwtToken = _auth.GenerateToken(adminUser.Id);

            return Ok(new { jwtToken = jwtToken });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            if (HttpContext.Session.GetString(AuthKeys.AdminUserToken) != null)
            {
                HttpContext.Session.Remove(AuthKeys.AdminUserToken);
            }

            return Ok(AuthKeys.AdminUserToken);
        }

        [HttpGet("loginstatus")]
        public bool GetLoginStatus()
        {
            return HttpContext.Session.GetString(AuthKeys.AdminUserToken) != null;
        }
    }
}