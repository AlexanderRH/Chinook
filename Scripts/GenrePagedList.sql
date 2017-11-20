USE [Chinook]
GO
CREATE PROCEDURE [dbo].[GenrePagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[GenreId]
		,[Name]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY GenreId ) AS RowNum
			,[GenreId]
			,[Name]
		FROM [dbo].[Genre]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END