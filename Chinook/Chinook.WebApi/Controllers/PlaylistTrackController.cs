using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/PlaylistTrack")]
    public class PlaylistTrackController : BaseController
    {
        public PlaylistTrackController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.PlaylistTrack.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.PlaylistTrack.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] PlaylistTrack playlistTrack)
        {
            if (ModelState.IsValid)
                return Ok(_unit.PlaylistTrack.Insert(playlistTrack));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] PlaylistTrack playlistTrack)
        {
            if (ModelState.IsValid && _unit.PlaylistTrack.Update(playlistTrack))
                return Ok(new { Message = "The playlistTrack is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.PlaylistTrack.Delete(new PlaylistTrack { PlaylistTrackId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.PlaylistTrack.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.PlaylistTrack.PagedList(startRecord, endRecord));
        }
    }
}
