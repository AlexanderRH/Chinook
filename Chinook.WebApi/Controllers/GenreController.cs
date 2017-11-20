using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/Genre")]
    public class GenreController : BaseController
    {
        public GenreController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.Genre.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Genre.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Genre genre)
        {
            if (ModelState.IsValid)
                return Ok(_unit.Genre.Insert(genre));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Genre genre)
        {
            if (ModelState.IsValid && _unit.Genre.Update(genre))
                return Ok(new { Message = "The genre is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.Genre.Delete(new Genre { GenreId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Genre.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Genre.PagedList(startRecord, endRecord));
        }
    }
}
