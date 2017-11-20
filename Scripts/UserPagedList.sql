USE [Chinook]
GO
CREATE PROCEDURE [dbo].[UserPagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[Id]
		,[Email]
		,[FirstName]
		,[LastName]
		,[Password]
		,[Roles]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY Id ) AS RowNum
			,[Id]
			,[Email]
			,[FirstName]
			,[LastName]
			,[Password]
			,[Roles]
		FROM [dbo].[User]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END