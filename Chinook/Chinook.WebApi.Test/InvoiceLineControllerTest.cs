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
    public class InvoiceLineControllerTest
    {
        private readonly InvoiceLineController _invoiceLineController;
        private readonly IUnitOfWork _unitMocked;

        public InvoiceLineControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _invoiceLineController = new InvoiceLineController(_unitMocked);
        }

        [Fact(DisplayName = "[InvoiceLineRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _invoiceLineController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<InvoiceLine>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[InvoiceLineRepository] GetById")]
        public void Test_GetById()
        {
            var result = _invoiceLineController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[InvoiceLineRepository] Post")]
        public void Test_Post()
        {
            var invoice = GetNewInvoiceLineLine();
            invoice.InvoiceLineId = 0;
            var result = _invoiceLineController.Post(invoice) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[InvoiceLineRepository] Put")]
        public void Test_Put()
        {
            var invoice = GetNewInvoiceLineLine();
            invoice.InvoiceLineId = 10;
            invoice.UnitPrice = 20;

            var result = _invoiceLineController.Put(invoice) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[InvoiceLineRepository] Delete")]
        public void Test_Delete()
        {
            var invoice = GetNewInvoiceLineLine();
            var resultCreate = _invoiceLineController.Post(invoice) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _invoiceLineController.Delete(invoice.InvoiceLineId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private InvoiceLine GetNewInvoiceLineLine()
        {
            return new InvoiceLine
            {
                InvoiceLineId = 100,
                InvoiceId = 1,
                TrackId = 1,
                UnitPrice = 10,
                Quantity = 2
            };
        }
    }
}
