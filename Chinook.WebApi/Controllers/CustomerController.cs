using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/Customer")]
    public class CustomerController : BaseController
    {
        public CustomerController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.Customer.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Customer.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Customer customer)
        {
            if (ModelState.IsValid)
                return Ok(_unit.Customer.Insert(customer));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Customer customer)
        {
            if (ModelState.IsValid && _unit.Customer.Update(customer))
                return Ok(new { Message = "The customer is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.Customer.Delete(new Customer { CustomerId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Customer.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Customer.PagedList(startRecord, endRecord));
        }
    }
}
