using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/Track")]
    public class TrackController : BaseController
    {
        public TrackController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.Track.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Track.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Track track)
        {
            if (ModelState.IsValid)
                return Ok(_unit.Track.Insert(track));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Track track)
        {
            if (ModelState.IsValid && _unit.Track.Update(track))
                return Ok(new { Message = "The track is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.Track.Delete(new Track { TrackId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Track.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Track.PagedList(startRecord, endRecord));
        }
    }
}
