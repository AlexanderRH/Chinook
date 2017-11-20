USE [Chinook]
GO
CREATE PROCEDURE [dbo].[EmployeePagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[EmployeeId]
		,[FirstName]
		,[LastName]
		,[Title]
		,[ReportsTo]
		,[BirthDate]
		,[HireDate]
		,[Address]
		,[City]
		,[State]
		,[Country]
		,[PostalCode]
		,[Phone]
		,[Fax]
		,[Email]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY EmployeeId ) AS RowNum
			,[EmployeeId]
			,[FirstName]
			,[LastName]
			,[Title]
			,[ReportsTo]
			,[BirthDate]
			,[HireDate]
			,[Address]
			,[City]
			,[State]
			,[Country]
			,[PostalCode]
			,[Phone]
			,[Fax]
			,[Email]
		FROM [dbo].[Employee]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END