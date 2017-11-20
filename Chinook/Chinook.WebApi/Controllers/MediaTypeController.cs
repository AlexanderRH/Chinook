using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/MediaType")]
    public class MediaTypeController : BaseController
    {
        public MediaTypeController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.MediaType.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.MediaType.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] MediaType mediaType)
        {
            if (ModelState.IsValid)
                return Ok(_unit.MediaType.Insert(mediaType));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] MediaType mediaType)
        {
            if (ModelState.IsValid && _unit.MediaType.Update(mediaType))
                return Ok(new { Message = "The mediaType is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.MediaType.Delete(new MediaType { MediaTypeId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.MediaType.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.MediaType.PagedList(startRecord, endRecord));
        }
    }
}
