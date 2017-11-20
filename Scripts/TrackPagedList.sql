USE [Chinook]
GO
CREATE PROCEDURE [dbo].[TrackPagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[TrackId]
		,[Name]
		,[AlbumId]
		,[MediaTypeId]
		,[GenreId]
		,[Composer]
		,[Milliseconds]
		,[Bytes]
		,[UnitPrice]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY TrackId ) AS RowNum
			,[TrackId]
			,[Name]
			,[AlbumId]
			,[MediaTypeId]
			,[GenreId]
			,[Composer]
			,[Milliseconds]
			,[Bytes]
			,[UnitPrice]
		FROM [dbo].[Track]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END