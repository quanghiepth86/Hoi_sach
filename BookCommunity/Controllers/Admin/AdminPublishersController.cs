﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BC.Data.Repositories;
using BC.Web.UploadFiles;
using BC.Web.Filters;
using BC.Data.Responses;
using BC.Data.Requests;
using BC.Data.Models;
using BC.Web.Constants;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace BookCommunity.Controllers
{
    [Produces("application/json")]
    [Route("api/admin/publishers")]
    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public class AdminPublishersController : Controller
    {
        private readonly IPublisherRepository _publisherRepository;
        private IUploadFileService _uploadFileService;

        public AdminPublishersController(IPublisherRepository publisherRepository, IUploadFileService uploadFileService)
        {
            _publisherRepository = publisherRepository;
            _uploadFileService = uploadFileService;
        }

        [NoCache]
        [HttpGet]
        public async Task<PublisherListResponse> Get([FromQuery]PagingRequest request)
        {
            var publishers = await _publisherRepository.GetList(request);
            var count = await _publisherRepository.CountAll();
            return new PublisherListResponse
            {
                Count = count,
                Items = publishers
            };
        }

        [HttpGet("{id}")]
        [MongoDbObjectIdFilter]
        public async Task<IActionResult> Get(string id)
        {
            var publisher = await _publisherRepository.GetById(id);
            if (publisher == null)
            {
                return NotFound();
            }

            return Ok(publisher);
        }

        [HttpPost]
        public void Post([FromBody]Publisher value)
        {
            _publisherRepository.Add(new Publisher
            {
                Name = value.Name,
                Logo = value.Logo,
                Country = value.Country,
                IsActive = value.IsActive,
                CreatedOn = DateTime.Now,
                UpdatedOn = DateTime.Now
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody]Publisher value)
        {
            var publisher = await _publisherRepository.GetById(id);
            if (publisher == null)
            {
                return BadRequest();
            }

            publisher.Name = value.Name;
            publisher.Logo = value.Logo;
            publisher.Country = value.Country;
            publisher.IsActive = value.IsActive;
            publisher.UpdatedOn = DateTime.Now;

            var updateResult = await _publisherRepository.Update(id, publisher);

            return Ok(updateResult);
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _publisherRepository.Remove(id);
        }

        [HttpPost("logos")]
        public async Task<UploadResult> Upload()
        {
            string updatedFileName = await _uploadFileService.UploadSigle(FolderPath.PublisherLogo, Request.Form);

            return new UploadResult
            {
                FileName = updatedFileName,
                Status = 200
            };
        }

        [HttpPost("logos/remove")]
        public void RemoveAvatar([FromBody]Avatar avatar)
        {
            _uploadFileService.RemoveFile(avatar.FileName);
        }
    }
}