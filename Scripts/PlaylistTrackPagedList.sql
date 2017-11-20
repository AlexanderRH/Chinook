USE [Chinook]
GO
CREATE PROCEDURE [dbo].[PlaylistTrackPagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[PlaylistTrackId]
		,[PlaylistId]
		,[TrackId]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY PlaylistTrackId ) AS RowNum
			,[PlaylistTrackId]
			,[PlaylistId]
			,[TrackId]
		FROM [dbo].[PlaylistTrack]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END