USE [Chinook]
GO
CREATE PROCEDURE [dbo].[AlbumPagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[AlbumId]
		,[Title]
		,[ArtistId]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY AlbumId ) AS RowNum
			,[AlbumId]
			,[Title]
			,[ArtistId]
		FROM [dbo].[Album]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END