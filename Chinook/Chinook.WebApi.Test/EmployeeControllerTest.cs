using Chinook.WebApi.Controllers;
using System.Collections.Generic;
using Chinook.UnitOfWork;
using Chinook.Mocked;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;
using Xunit;
using FluentAssertions;
using System;

namespace Chinook.WebApi.Test
{
    public class EmployeeControllerTest
    {
        private readonly EmployeeController _employeeController;
        private readonly IUnitOfWork _unitMocked;

        public EmployeeControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _employeeController = new EmployeeController(_unitMocked);
        }

        [Fact(DisplayName = "[EmployeeRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _employeeController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Employee>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[EmployeeRepository] GetById")]
        public void Test_GetById()
        {
            var result = _employeeController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[EmployeeRepository] Post")]
        public void Test_Post()
        {
            var employee = GetNewEmployee();
            employee.EmployeeId = 0;
            var result = _employeeController.Post(employee) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[EmployeeRepository] Put")]
        public void Test_Put()
        {
            var employee = GetNewEmployee();
            employee.EmployeeId = 10;
            employee.FirstName = "Alex";

            var result = _employeeController.Put(employee) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[EmployeeRepository] Delete")]
        public void Test_Delete()
        {
            var employee = GetNewEmployee();
            var resultCreate = _employeeController.Post(employee) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _employeeController.Delete(employee.EmployeeId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Employee GetNewEmployee()
        {
            return new Employee
            {
                EmployeeId = 100,
                LastName = "Alexander",
                FirstName = "Rodriguez",
                Title = "Title",
                ReportsTo = 1,
                BirthDate = DateTime.Now,
                HireDate = DateTime.Now,
                Address = "Av. Roosevelt",
                City = "Lima",
                State = "Lima",
                Country = "Perú",
                PostalCode = "45479",
                Phone = "1548787",
                Fax = "26499898",
                Email = "alexrod2121@gmail.com"
            };
        }
    }
}
