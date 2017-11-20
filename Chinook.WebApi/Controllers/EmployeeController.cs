using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/Employee")]
    public class EmployeeController : BaseController
    {
        public EmployeeController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.Employee.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Employee.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Employee employee)
        {
            if (ModelState.IsValid)
                return Ok(_unit.Employee.Insert(employee));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Employee employee)
        {
            if (ModelState.IsValid && _unit.Employee.Update(employee))
                return Ok(new { Message = "The employee is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.Employee.Delete(new Employee { EmployeeId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Employee.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Employee.PagedList(startRecord, endRecord));
        }
    }
}
