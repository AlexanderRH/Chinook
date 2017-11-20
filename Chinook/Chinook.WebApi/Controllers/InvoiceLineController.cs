using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/InvoiceLine")]
    public class InvoiceLineController : BaseController
    {
        public InvoiceLineController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.InvoiceLine.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.InvoiceLine.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] InvoiceLine invoiceLine)
        {
            if (ModelState.IsValid)
                return Ok(_unit.InvoiceLine.Insert(invoiceLine));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] InvoiceLine invoiceLine)
        {
            if (ModelState.IsValid && _unit.InvoiceLine.Update(invoiceLine))
                return Ok(new { Message = "The invoiceLine is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.InvoiceLine.Delete(new InvoiceLine { InvoiceLineId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.InvoiceLine.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.InvoiceLine.PagedList(startRecord, endRecord));
        }
    }
}
