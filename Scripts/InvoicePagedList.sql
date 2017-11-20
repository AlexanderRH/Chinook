USE [Chinook]
GO
CREATE PROCEDURE [dbo].[InvoicePagedList]
	@startRow int,
	@endRow int
AS
BEGIN
	SELECT
		[InvoiceId]
		,[InvoiceDate]
		,[BillingAddress]
		,[BillingCity]
		,[BillingState]
		,[BillingCountry]
		,[BillingPostalCode]
		,[Total]
	FROM (
		SELECT
			ROW_NUMBER() OVER ( ORDER BY InvoiceId ) AS RowNum
			,[InvoiceId]
			,[InvoiceDate]
			,[BillingAddress]
			,[BillingCity]
			,[BillingState]
			,[BillingCountry]
			,[BillingPostalCode]
			,[Total]
		FROM [dbo].[Invoice]
	) AS RowConstrainedResult
	WHERE RowNum >= @startRow
	  AND RowNum <= @endRow
	ORDER BY RowNum
END