USE [Chinook]
GO
CREATE PROCEDURE [dbo].[CustomerPagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[CustomerId]
		,[FirstName]
		,[LastName]
		,[Company]
		,[Address]
		,[City]
		,[State]
		,[Country]
		,[PostalCode]
		,[Phone]
		,[Fax]
		,[Email]
		,[SupportRepId]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY CustomerId ) AS RowNum
			,[CustomerId]
			,[FirstName]
			,[LastName]
			,[Company]
			,[Address]
			,[City]
			,[State]
			,[Country]
			,[PostalCode]
			,[Phone]
			,[Fax]
			,[Email]
			,[SupportRepId]
		FROM [dbo].[Customer]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END