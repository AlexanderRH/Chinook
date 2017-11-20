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
    public class InvoiceControllerTest
    {
        private readonly InvoiceController _invoiceController;
        private readonly IUnitOfWork _unitMocked;

        public InvoiceControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _invoiceController = new InvoiceController(_unitMocked);
        }

        [Fact(DisplayName = "[InvoiceRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _invoiceController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Invoice>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[InvoiceRepository] GetById")]
        public void Test_GetById()
        {
            var result = _invoiceController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[InvoiceRepository] Post")]
        public void Test_Post()
        {
            var invoice = GetNewInvoice();
            invoice.InvoiceId = 0;
            var result = _invoiceController.Post(invoice) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[InvoiceRepository] Put")]
        public void Test_Put()
        {
            var invoice = GetNewInvoice();
            invoice.InvoiceId = 10;
            invoice.BillingCity = "Trujillo";

            var result = _invoiceController.Put(invoice) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[InvoiceRepository] Delete")]
        public void Test_Delete()
        {
            var invoice = GetNewInvoice();
            var resultCreate = _invoiceController.Post(invoice) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _invoiceController.Delete(invoice.InvoiceId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Invoice GetNewInvoice()
        {
            return new Invoice
            {
                InvoiceId = 100,
                CustomerId = 1,
                InvoiceDate = DateTime.Now,
                BillingAddress = "Address",
                BillingCity = "Lima",
                BillingState = "Lima",
                BillingCountry = "Perú",
                BillingPostalCode = "47798",
                Total = 10
            };
        }
    }
}
