using Chinook.Models;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Chinook.WebApi.Controllers
{
    [Route("api/Playlist")]
    public class PlaylistController : BaseController
    {
        public PlaylistController(IUnitOfWork unit) : base(unit)
        {
        }

        public IActionResult GetList()
        {
            return Ok(_unit.Playlist.GetList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Playlist.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Playlist playlist)
        {
            if (ModelState.IsValid)
                return Ok(_unit.Playlist.Insert(playlist));

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Playlist playlist)
        {
            if (ModelState.IsValid && _unit.Playlist.Update(playlist))
                return Ok(new { Message = "The playlist is updated" });

            return BadRequest(ModelState);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
                return Ok(_unit.Playlist.Delete(new Playlist { PlaylistId = id.Value }));

            return BadRequest(new { Message = "Incorrect data." });
        }
        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Playlist.Count());
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Playlist.PagedList(startRecord, endRecord));
        }
    }
}
