using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/Invoice")]
    public class InvoiceController : BaseController
    {
        public InvoiceController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.Invoice.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Invoice.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Invoice invoice)
        {
            if (ModelState.IsValid)
                return Ok(_unit.Invoice.Insert(invoice));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Invoice invoice)
        {
            if (ModelState.IsValid && _unit.Invoice.Update(invoice))
                return Ok(new { Message = "The invoice is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.Invoice.Delete(new Invoice { InvoiceId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Invoice.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Invoice.PagedList(startRecord, endRecord));
        }
    }
}
