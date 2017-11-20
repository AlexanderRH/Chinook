USE [Chinook]
GO
CREATE PROCEDURE [dbo].[InvoiceLinePagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[InvoiceLineId]
		,[InvoiceId]
		,[TrackId]
		,[UnitPrice]
		,[Quantity]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY InvoiceLineId ) AS RowNum
			,[InvoiceLineId]
			,[InvoiceId]
			,[TrackId]
			,[UnitPrice]
			,[Quantity]
		FROM [dbo].[InvoiceLine]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END