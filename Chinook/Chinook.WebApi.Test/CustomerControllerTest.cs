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
    public class CustomerControllerTest
    {
        private readonly CustomerController _customerController;
        private readonly IUnitOfWork _unitMocked;

        public CustomerControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _customerController = new CustomerController(_unitMocked);
        }

        [Fact(DisplayName = "[CustomerRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _customerController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Customer>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[CustomerRepository] GetById")]
        public void Test_GetById()
        {
            var result = _customerController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[CustomerRepository] Post")]
        public void Test_Post()
        {
            var customer = GetNewCustomer();
            customer.CustomerId = 0;
            var result = _customerController.Post(customer) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[CustomerRepository] Put")]
        public void Test_Put()
        {
            var customer = GetNewCustomer();
            customer.CustomerId = 10;
            customer.City = "Trujillo";

            var result = _customerController.Put(customer) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[CustomerRepository] Delete")]
        public void Test_Delete()
        {
            var customer = GetNewCustomer();
            var resultCreate = _customerController.Post(customer) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _customerController.Delete(customer.CustomerId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Customer GetNewCustomer()
        {
            return new Customer
            {
                CustomerId = 100,
                FirstName = "Alexander",
                LastName = "Rodriguez",
                Company = "GNT",
                Address = "Av. Roosevelt",
                City = "Lima",
                State = "Lima",
                Country = "Perú",
                PostalCode = "45789",
                Phone = "1234567",
                Fax = "1234567",
                Email = "alexrod2121@gmail.com",
                SupportRepId = 3
            };
        }
    }
}
