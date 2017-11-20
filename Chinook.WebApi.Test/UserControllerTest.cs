using Chinook.WebApi.Controllers;
using System.Collections.Generic;
using Chinook.UnitOfWork;
using Chinook.Mocked;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;
using Xunit;
using FluentAssertions;

namespace Chinook.WebApi.Test
{
    public class UserControllerTest
    {
        private readonly UserController _userController;
        private readonly IUnitOfWork _unitMocked;

        public UserControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _userController = new UserController(_unitMocked);
        }

        [Fact(DisplayName = "[UserRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _userController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<User>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[UserRepository] GetById")]
        public void Test_GetById()
        {
            var result = _userController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[UserRepository] Post")]
        public void Test_Post()
        {
            var user = GetNewUser();
            user.Id = 0;
            var result = _userController.Post(user) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[UserRepository] Put")]
        public void Test_Put()
        {
            var user = GetNewUser();
            user.Id = 10;
            user.FirstName = "New User";

            var result = _userController.Put(user) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[UserRepository] Delete")]
        public void Test_Delete()
        {
            var user = GetNewUser();
            var resultCreate = _userController.Post(user) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _userController.Delete(user.Id) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private User GetNewUser()
        {
            return new User
            {
                Id = 100,
                Email = "alexrod2121@gmail.com",
                FirstName = "Alexander",
                LastName = "Rodriguez",
                Password = "password",
                Roles = "admin"
            };
        }
    }
}

