CREATE PROCEDURE dbo.ValidateUser 
	@email varchar(100),
	@password varchar(20)
AS
BEGIN
	SELECT [Email]
      ,[FirstName]
      ,[LastName]
      ,[Password]
      ,[Roles]
  FROM [dbo].[User]
  WHERE Email=@email AND [Password] = @password
END
GO
